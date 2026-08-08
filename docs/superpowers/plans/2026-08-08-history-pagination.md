# History 资料卡分页交互 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 History 资料卡增加首尾边界正确的上一页/下一页控制，并同步资料卡内容与时间线选中节点。

**Architecture:** `History.jsx` 保持单一 `currentIndex` 状态，时间线点击与分页按钮共同更新该索引；只有时间线点击继续执行现有资料卡居中滚动。资料卡外层以索引作为 `key`，配合 `src/styles.css` 中的 300ms 淡入动画重新入场。

**Tech Stack:** React 18、React Router 6、普通 CSS、Vitest、Testing Library

## Global Constraints

- 不改变现有页面布局、时间线节点点击逻辑和滚动定位。
- 第一项不渲染“上一页”，最后一项不渲染“下一页”。
- 分页切换同步更新时间线选中节点。
- 不新增第三方依赖。
- 保留工作区中与传承人物相关的既有未提交修改。

---

### Task 1: History 资料卡分页状态与边界行为

**Files:**
- Modify: `src/pages/History.test.jsx`
- Modify: `src/pages/History.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `historyTimeline`, `HistoryScroll({ items, activeIndex, onSelect })`, `HistoryDetailCard({ item })`
- Produces: `currentIndex` 单一状态、`handleNodeClick(index)`、`handlePageChange(index)`、`.history-detail-stage`、`.history-detail-pagination`

- [ ] **Step 1: 写入失败测试，覆盖分页边界与时间线同步**

在 `History.test.jsx` 中从历史长卷区域获取时间线按钮，避免新增分页按钮影响原有十节点断言：

```jsx
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'

function getTimelineNodes() {
  return within(
    screen.getByRole('region', { name: '潮州嵌瓷历史长卷' }),
  ).getAllByRole('button')
}
```

把现有全局 `screen.getAllByRole('button')` 调用替换为 `getTimelineNodes()`，并增加：

```jsx
it('pages through detail cards and keeps the timeline selection in sync', () => {
  renderHistory()

  expect(screen.queryByRole('button', { name: '上一页' })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: '下一页' })).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: '下一页' }))

  expect(getTimelineNodes()[1]).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: '上一页' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '下一页' })).toBeInTheDocument()

  for (let index = 1; index < 9; index += 1) {
    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
  }

  expect(getTimelineNodes()[9]).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: '上一页' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: '下一页' })).not.toBeInTheDocument()
})
```

该测试捕获的回归：缺少分页按钮、首尾边界错误，或分页只换资料卡却未同步时间线高亮。

- [ ] **Step 2: 运行定向测试并确认正确失败**

Run: `npm run test -- --run src/pages/History.test.jsx`

Expected: FAIL，原因是页面尚未渲染名称为“下一页”的按钮，而不是测试配置错误。

- [ ] **Step 3: 在 History.jsx 中实现最小分页逻辑**

将状态命名为 `currentIndex`，保留节点点击滚动，并增加不触发滚动的分页切换：

```jsx
const [currentIndex, setCurrentIndex] = useState(0)
const currentItem = historyTimeline[currentIndex]

const handleNodeClick = (index) => {
  setCurrentIndex(index)
  requestAnimationFrame(() => {
    activeCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  })
}

const handlePageChange = (index) => {
  setCurrentIndex(index)
}
```

把 `currentIndex` 传给 `HistoryScroll`，并将资料卡区域改为：

```jsx
<div
  className="history-detail-stage"
  ref={activeCardRef}
  key={currentIndex}
>
  <HistoryDetailCard item={currentItem} />
  <nav className="history-detail-pagination" aria-label="历史资料卡分页">
    <span>
      {currentIndex > 0 ? (
        <button type="button" onClick={() => handlePageChange(currentIndex - 1)}>
          上一页
        </button>
      ) : null}
    </span>
    <span>
      {currentIndex < historyTimeline.length - 1 ? (
        <button type="button" onClick={() => handlePageChange(currentIndex + 1)}>
          下一页
        </button>
      ) : null}
    </span>
  </nav>
</div>
```

- [ ] **Step 4: 增加 300ms 淡入和分页按钮样式**

在现有 History 样式段落追加，不改已有选择器：

```css
.history-detail-stage {
  animation: history-detail-fade-in 300ms ease both;
}

.history-detail-pagination {
  display: flex;
  justify-content: space-between;
  min-height: 64px;
  padding: 14px 24px;
  border: 1px solid var(--gold-soft);
  border-top: 0;
  background: rgba(255, 252, 246, 0.42);
}

.history-detail-pagination button {
  padding: 8px 18px;
  color: var(--vermilion);
  font: inherit;
  letter-spacing: 0.12em;
  background: transparent;
  border: 1px solid var(--gold-soft);
  cursor: pointer;
}

@keyframes history-detail-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

- [ ] **Step 5: 运行 History 测试并确认通过**

Run: `npm run test -- --run src/pages/History.test.jsx`

Expected: History 测试全部 PASS；既有节点横向滚动与资料卡居中滚动断言保持通过。

- [ ] **Step 6: 执行完整测试和生产构建**

Run: `npm run test -- --run`

Expected: 全部测试 PASS。

Run: `npm run build`

Expected: Vite 构建成功，并生成 CloudBase SPA 回退文件。

- [ ] **Step 7: 浏览器验证目标流程**

Flow: `/history` → 点击“下一页” → 资料卡淡入且第二个时间线节点高亮 → 连续翻到最后一页 → 只显示“上一页” → 点击时间线中间节点 → 保持原有横向定位并把资料卡滚动到视口中心。

同时检查页面标题、非空渲染、无错误覆盖层、控制台无相关错误、桌面视口无按钮遮挡。

- [ ] **Step 8: 仅在用户要求时提交实现**

提交时只暂存 `History.jsx`、`History.test.jsx` 与 `src/styles.css` 中本次分页样式；不得包含现有传承人物相关工作区修改。
