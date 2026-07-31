# 建筑再生嵌瓷元素提取 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/modern` 案例 01 现有“嵌瓷元素提取”模块升级为色彩、纹样、拼接结构三个独立展陈单元，同时保持案例 02、03 原有展示。

**Architecture:** 在案例 01 数据中加入专用 `extractions` 数组，详情组件根据该字段做局部条件渲染；没有该字段的案例继续走现有列表与单占位框。样式限定在 `.modern-extraction-*` 命名空间内。

**Tech Stack:** React 18、Vitest、Testing Library、普通 CSS

## Global Constraints

- 保持现有页面结构、三个案例切换和自动滚动。
- 仅修改案例 01「建筑再生」，不改变案例 02、03 数据。
- 不新增外部图片或站内图片；三个提取单元使用现有占位组件。
- 保持米白背景、宋体、朱红细线和现有中式展陈视觉。
- 不修改其他页面或路由。

---

### Task 1: 锁定案例兼容行为

**Files:**
- Test: `src/pages/Modern.test.jsx`

**Interfaces:**
- Consumes: `Modern` 页面默认选中案例 01，并可通过按钮切换案例。
- Produces: 对案例 01 三单元及案例 02 原有回退展示的行为约束。

- [ ] **Step 1: 写案例 01 的失败测试**

在现有建筑案例测试后增加：

```jsx
it('shows three extraction exhibits only for the architecture case', () => {
  render(<Modern />)

  expect(screen.getByRole('heading', { name: '色彩提取', level: 4 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '纹样提取', level: 4 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '拼接结构提取', level: 4 })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: '色彩提取占位区域' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: '纹样提取占位区域' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: '拼接结构提取占位区域' })).toBeInTheDocument()
})
```

- [ ] **Step 2: 写案例 02 回退展示测试**

```jsx
it('keeps the original extraction presentation for other cases', () => {
  render(<Modern />)
  fireEvent.click(screen.getByRole('button', { name: '02 日常新生' }))

  expect(screen.getByText('花瓣曲线')).toBeInTheDocument()
  expect(screen.getByRole('img', { name: '纹样提取预览占位区域' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: '色彩提取', level: 4 })).not.toBeInTheDocument()
})
```

- [ ] **Step 3: 运行定向测试并确认失败**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: 新增案例 01 测试因缺少三个四级标题而失败，已有测试保持通过。

---

### Task 2: 实现三单元数据与条件展示

**Files:**
- Modify: `src/data/modernCases.js`
- Modify: `src/components/ModernCaseDetail.jsx`
- Modify: `src/styles.css`
- Test: `src/pages/Modern.test.jsx`

**Interfaces:**
- Consumes: `item.extractions?: Array<{ id: string, number: string, title: string, description: string }>`。
- Produces: `ExtractionGallery({ extractions })`，渲染三个编号、标题、说明及 `ExhibitPlaceholder`。

- [ ] **Step 1: 给案例 01 增加专用数据**

在 `architecture` 的 `elements` 后增加：

```js
extractions: [
  {
    id: 'color',
    number: '01',
    title: '色彩提取',
    description: '提炼低饱和朱红、釉绿与金色关系，保留传统建筑装饰的节奏和层次。',
  },
  {
    id: 'pattern',
    number: '02',
    title: '纹样提取',
    description: '从龙凤、花鸟及卷草中提取轮廓与连续构图，形成可复用的现代图形语言。',
  },
  {
    id: 'structure',
    number: '03',
    title: '拼接结构提取',
    description: '分析瓷片的方向排列、碎片层叠和高低起伏，呈现嵌瓷特有的立体秩序。',
  },
],
```

- [ ] **Step 2: 增加最小展示组件并条件渲染**

在 `ModernCaseDetail.jsx` 中增加：

```jsx
function ExtractionGallery({ extractions }) {
  return (
    <div className="modern-extraction-grid">
      {extractions.map((extraction) => (
        <section className="modern-extraction-item" key={extraction.id}>
          <div className="modern-extraction-item__copy">
            <p>{extraction.number}</p>
            <h4>{extraction.title}</h4>
            <span>{extraction.description}</span>
          </div>
          <ExhibitPlaceholder label={extraction.title} />
        </section>
      ))}
    </div>
  )
}
```

将第二个 `article` 的类名与内容改为条件分支：案例 01 保留模块标题并展示 `ExtractionGallery`，其他案例继续渲染现有 `elements` 列表和“纹样提取预览”占位框。

- [ ] **Step 3: 增加局部三列样式**

在现代页样式区增加：

```css
.modern-detail-block--extraction {
  grid-template-columns: 1fr;
  padding: 72px 0;
}

.modern-detail-block--extraction > .modern-detail-block__copy {
  padding: 0 64px 48px;
}

.modern-extraction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--vermilion);
  border-bottom: 1px solid var(--gold-soft);
}

.modern-extraction-item {
  min-width: 0;
  padding: 28px;
  background: var(--paper);
  border-right: 1px solid var(--vermilion);
}

.modern-extraction-item:last-child {
  border-right: 0;
}

.modern-extraction-item__copy > p {
  margin: 0;
  color: var(--vermilion);
  font-size: 12px;
  letter-spacing: 0.18em;
}

.modern-extraction-item__copy h4 {
  margin: 16px 0;
  color: var(--ink);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.modern-extraction-item__copy span {
  display: block;
  min-height: 90px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.modern-extraction-item .modern-placeholder {
  min-height: 260px;
  margin-top: 24px;
  border: 1px solid var(--gold-soft);
}
```

- [ ] **Step 4: 运行定向测试**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: `/modern` 全部测试通过。

---

### Task 3: 全量与视觉验证

**Files:**
- Verify only: `src/data/modernCases.js`, `src/components/ModernCaseDetail.jsx`, `src/styles.css`, `src/pages/Modern.test.jsx`

**Interfaces:**
- Consumes: 已实现的案例 01 三单元展示。
- Produces: 可提交、无回归的 `/modern` 页面。

- [ ] **Step 1: 运行全量测试**

Run: `npm test -- --run`

Expected: 全部测试通过。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: Vite 构建成功且无错误。

- [ ] **Step 3: 验证 1280×720 页面**

启动本地预览并在 1280×720 检查 `/modern`：案例 01 展示三个横向单元、文字无遮挡、页面无横向溢出；切换案例 02、03 后仍为原列表和单占位框，自动滚动正常。

- [ ] **Step 4: 检查改动范围**

Run: `git diff --check` and `git status --short`

Expected: 仅本计划、案例数据、详情组件、局部样式和现代页测试发生变化，无空白错误。

- [ ] **Step 5: 提交功能**

```bash
git add src/data/modernCases.js src/components/ModernCaseDetail.jsx src/styles.css src/pages/Modern.test.jsx docs/superpowers/plans/2026-07-31-modern-architecture-extraction.md
git commit -m "v0.6 建筑再生元素提取展示"
```
