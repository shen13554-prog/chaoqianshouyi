# Building Modal Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Building 页现有建筑研究弹窗增加四项资料的上一页/下一页切换与 400ms 方向动画，同时保持弹窗布局、关闭逻辑和建筑资料不变。

**Architecture:** 继续以 `architectureCase.sourceImages` 作为唯一建筑数据数组，由 `BuildingResearchGallery` 根据 `activeId` 计算当前索引。分页动作先在组件内部进入退出阶段，400ms 后调用现有 `onToggle(nextId)` 切换数据，再播放对应方向的进入阶段；弹窗外壳、关闭按钮和遮罩始终不重建。

**Tech Stack:** React 18、React Portal、普通 CSS、Vitest、Testing Library、Vite

## Global Constraints

- 仅修改 Building 相关组件、测试和 Building 弹窗相关 CSS。
- 不修改建筑资料内容、其他页面、路由、Header 或 Footer。
- 保留现有左图右文布局、关闭按钮位置、字体、颜色和图片 `object-fit: contain`。
- 第一项只显示“下一页”，中间项显示两侧按钮，最后一项只显示“上一页”。
- 翻页退出和进入动画各使用 400ms，页面不刷新。
- 当前工作区存在其他页面未提交修改，验证和后续暂存必须避免夹带无关文件。

---

### Task 1: 用测试锁定分页边界、资料同步和方向阶段

**Files:**
- Modify: `src/pages/Building.test.jsx`
- Test: `src/pages/Building.test.jsx`

**Interfaces:**
- Consumes: `Building` 组件以及现有 `architectureCase.sourceImages` 顺序。
- Produces: 一个覆盖首项、中间项、末项和双向动画的回归测试。

- [ ] **Step 1: 在测试导入中加入 `act`**

```jsx
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
```

- [ ] **Step 2: 写入失败的分页测试**

在 `architecture regeneration detail` 测试组中加入：

```jsx
it('pages through building research cards with directional transitions', () => {
  window.localStorage.setItem('chaoqianshouyi-building-guide-seen', 'true')
  vi.useFakeTimers()

  try {
    render(<Building />)
    fireEvent.click(screen.getByRole('button', { name: '查看安济王庙研究详情' }))

    let dialog = screen.getByRole('dialog', { name: '安济王庙研究详情' })
    expect(within(dialog).queryByRole('button', { name: '上一页' })).not.toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: '下一页' })).toBeInTheDocument()

    fireEvent.click(within(dialog).getByRole('button', { name: '下一页' }))
    expect(within(dialog).getByTestId('building-modal-page')).toHaveClass('is-exiting-next')

    act(() => vi.advanceTimersByTime(400))
    dialog = screen.getByRole('dialog', { name: '广济楼天后宫研究详情' })
    expect(within(dialog).getByText('宫庙式公共文化建筑')).toBeInTheDocument()
    expect(within(dialog).getByTestId('building-modal-page')).toHaveClass('is-entering-next')
    expect(within(dialog).getByRole('button', { name: '上一页' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: '下一页' })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(400))
    fireEvent.click(within(dialog).getByRole('button', { name: '下一页' }))
    act(() => vi.advanceTimersByTime(800))
    dialog = screen.getByRole('dialog', { name: '观音庙研究详情' })
    fireEvent.click(within(dialog).getByRole('button', { name: '下一页' }))
    act(() => vi.advanceTimersByTime(400))

    dialog = screen.getByRole('dialog', { name: '从熙公祠研究详情' })
    expect(within(dialog).getByRole('button', { name: '上一页' })).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: '下一页' })).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(400))
    fireEvent.click(within(dialog).getByRole('button', { name: '上一页' }))
    expect(within(dialog).getByTestId('building-modal-page')).toHaveClass('is-exiting-previous')
    act(() => vi.advanceTimersByTime(400))

    dialog = screen.getByRole('dialog', { name: '观音庙研究详情' })
    expect(within(dialog).getByTestId('building-modal-page')).toHaveClass('is-entering-previous')
  } finally {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  }
})
```

- [ ] **Step 3: 运行单项测试并确认先失败**

Run:

```powershell
npm run test -- src/pages/Building.test.jsx -t "pages through building research cards"
```

Expected: FAIL，因为弹窗尚无“下一页”按钮和 `building-modal-page` 测试节点。

---

### Task 2: 实现受控分页状态和定时器清理

**Files:**
- Modify: `src/components/BuildingResearchGallery.jsx`
- Test: `src/pages/Building.test.jsx`

**Interfaces:**
- Consumes: `images: Array<{ id, src, name, type, location, meaning }>`、`activeId: string | null`、`onToggle(imageId: string): void`。
- Produces: `handlePageChange(direction: 'previous' | 'next')`，以及 `idle`、`exit`、`enter` 三阶段状态。

- [ ] **Step 1: 增加分页状态、当前索引和定时器引用**

在现有 ref/state 声明附近加入：

```jsx
const transitionTimerRef = useRef(null)
const [pageTransition, setPageTransition] = useState({
  phase: 'idle',
  direction: null,
})
const activeIndex = images.findIndex((image) => image.id === activeId)
```

- [ ] **Step 2: 增加卸载清理和统一关闭函数**

```jsx
useEffect(() => () => {
  window.clearTimeout(transitionTimerRef.current)
}, [])

const resetPageTransition = () => {
  window.clearTimeout(transitionTimerRef.current)
  setPageTransition({ phase: 'idle', direction: null })
}

const closeActiveBuilding = () => {
  resetPageTransition()
  onToggle(activeBuilding.id)
}
```

`closeActiveBuilding` 只在 `activeBuilding` 存在的弹窗分支中使用。

- [ ] **Step 3: 实现 400ms 退出、切换、进入流程**

```jsx
const handlePageChange = (direction) => {
  if (pageTransition.phase !== 'idle') return

  const offset = direction === 'next' ? 1 : -1
  const nextBuilding = images[activeIndex + offset]
  if (!nextBuilding) return

  setPageTransition({ phase: 'exit', direction })
  transitionTimerRef.current = window.setTimeout(() => {
    onToggle(nextBuilding.id)
    setPageTransition({ phase: 'enter', direction })
    transitionTimerRef.current = window.setTimeout(() => {
      setPageTransition({ phase: 'idle', direction: null })
    }, 400)
  }, 400)
}
```

- [ ] **Step 4: 生成稳定的方向类名**

```jsx
const pageTransitionClass = pageTransition.phase === 'idle'
  ? ''
  : ` is-${pageTransition.phase}ing-${pageTransition.direction}`
```

最终类名分别为 `is-exiting-next`、`is-exiting-previous`、`is-entering-next`、`is-entering-previous`。

- [ ] **Step 5: 保持弹窗外壳不变并包装动态内容**

用以下包装层包住现有图片和文字两个节点，不改变它们内部结构：

```jsx
<div
  className={`building-research-modal__page${pageTransitionClass}`}
  data-testid="building-modal-page"
  key={activeBuilding.id}
>
  <div className="building-research-detail__image">...</div>
  <div className="building-research-detail__copy">...</div>
</div>
```

将遮罩和关闭按钮的现有 `onClick={() => onToggle(activeBuilding.id)}` 改为 `onClick={closeActiveBuilding}`，其他关闭语义不变。

- [ ] **Step 6: 加入首中末分页按钮**

在动态内容包装层之后、`section` 结束之前加入：

```jsx
<nav className="building-research-pagination" aria-label="建筑资料分页">
  {activeIndex > 0 ? (
    <button
      type="button"
      className="building-research-pagination__button building-research-pagination__button--previous"
      onClick={() => handlePageChange('previous')}
      disabled={pageTransition.phase !== 'idle'}
    >
      上一页
    </button>
  ) : null}
  {activeIndex < images.length - 1 ? (
    <button
      type="button"
      className="building-research-pagination__button building-research-pagination__button--next"
      onClick={() => handlePageChange('next')}
      disabled={pageTransition.phase !== 'idle'}
    >
      下一页
    </button>
  ) : null}
</nav>
```

- [ ] **Step 7: 运行分页测试并确认结构逻辑通过**

Run:

```powershell
npm run test -- src/pages/Building.test.jsx -t "pages through building research cards"
```

Expected: PASS。

---

### Task 3: 添加 400ms 方向动画和底角按钮样式

**Files:**
- Modify: `src/styles.css`，仅编辑 `.building-research-modal` 相关区域
- Test: `src/pages/Building.test.jsx`

**Interfaces:**
- Consumes: Task 2 产生的 `.building-research-modal__page`、四个阶段类名和分页按钮类名。
- Produces: 保持原两栏尺寸的内容层、左右下角按钮、400ms 双向过渡。

- [ ] **Step 1: 将两栏网格职责移到动态内容层**

保持 `.building-research-detail` 的边框和容器职责，将列布局放到新包装层：

```css
.building-research-detail {
  position: relative;
  margin-top: 1px;
  overflow: hidden;
  border: 1px solid var(--gold-soft);
}

.building-research-modal__page {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  width: 100%;
}
```

- [ ] **Step 2: 加入四个 400ms 方向动画**

```css
.building-research-modal__page.is-exiting-next {
  animation: building-page-exit-left 400ms ease both;
}

.building-research-modal__page.is-entering-next {
  animation: building-page-enter-right 400ms ease both;
}

.building-research-modal__page.is-exiting-previous {
  animation: building-page-exit-right 400ms ease both;
}

.building-research-modal__page.is-entering-previous {
  animation: building-page-enter-left 400ms ease both;
}

@keyframes building-page-exit-left {
  to { opacity: 0; transform: translateX(-32px); }
}

@keyframes building-page-enter-right {
  from { opacity: 0; transform: translateX(32px); }
}

@keyframes building-page-exit-right {
  to { opacity: 0; transform: translateX(32px); }
}

@keyframes building-page-enter-left {
  from { opacity: 0; transform: translateX(-32px); }
}
```

- [ ] **Step 3: 增加左右下角分页按钮**

```css
.building-research-pagination {
  position: absolute;
  z-index: 2;
  right: 28px;
  bottom: 20px;
  left: 28px;
  pointer-events: none;
}

.building-research-pagination__button {
  position: absolute;
  bottom: 0;
  padding: 6px 0;
  color: var(--brown);
  font: inherit;
  letter-spacing: 0.12em;
  background: color-mix(in srgb, var(--paper) 90%, transparent);
  border: 0;
  border-bottom: 1px solid var(--gold-soft);
  cursor: pointer;
  pointer-events: auto;
}

.building-research-pagination__button--previous { left: 0; }
.building-research-pagination__button--next { right: 0; }

.building-research-pagination__button:disabled {
  cursor: default;
  opacity: 0.45;
}
```

- [ ] **Step 4: 运行全部 Building 测试**

Run:

```powershell
npm run test -- src/pages/Building.test.jsx
```

Expected: Building 测试全部通过，原有首次引导、四建筑弹窗、关闭按钮和遮罩测试保持通过。

---

### Task 4: 构建与范围核验

**Files:**
- Verify: `src/components/BuildingResearchGallery.jsx`
- Verify: `src/pages/Building.test.jsx`
- Verify: `src/styles.css`

**Interfaces:**
- Consumes: Tasks 1–3 的完整实现。
- Produces: 可构建且仅影响 Building 弹窗的验证结果。

- [ ] **Step 1: 检查改动范围**

Run:

```powershell
git diff -- src/components/BuildingResearchGallery.jsx src/pages/Building.test.jsx src/styles.css
git status --short
```

Expected: 本功能新增代码只出现在 Building 组件、Building 测试和 `styles.css` 的 Building 弹窗区域；状态列表中现有 History、Home、Process 修改保持未被本任务改写。

- [ ] **Step 2: 运行生产构建**

Run:

```powershell
npm run build
```

Expected: Vite 构建成功，并生成 CloudBase SPA 回退文件。

- [ ] **Step 3: 最终行为核验**

依次从四张建筑图片打开弹窗，验证：

```text
安济王庙：仅下一页
广济楼天后宫：上一页 + 下一页
观音庙：上一页 + 下一页
从熙公祠：仅上一页
下一页：旧内容向左退出，新内容从右进入
上一页：旧内容向右退出，新内容从左进入
关闭按钮：立即关闭
遮罩空白：立即关闭
```

Expected: 图片、建筑名称、建筑类型、嵌瓷应用位置和文化寓意随页码同步更新，无图片加载错误。
