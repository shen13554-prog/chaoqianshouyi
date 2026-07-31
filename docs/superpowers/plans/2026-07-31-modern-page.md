# 潮艺新生页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 `/modern` 路由内实现三个现代转译案例的同页选择与沉浸式详情展示。

**Architecture:** `Modern.jsx` 管理当前案例和详情区引用；`modernCases.js` 保存三个案例数据；`ModernCaseSelector.jsx` 与 `ModernCaseDetail.jsx` 分别负责入口和详情展示。全部交互使用 React 本地状态，不修改路由。

**Tech Stack:** React 18、React Router 6、普通 CSS、Vitest、Testing Library。

## Global Constraints

- 保留 `/modern` 路由，不增加子路由。
- 不修改其他页面。
- 不添加外部图片，仅使用代码生成的展陈占位区域。
- 延续米白背景、宋体、朱红强调、金色细线和中式展陈风格。
- 不添加复杂动画。

---

### Task 1: Modern 同页案例体验

**Files:**
- Create: `src/data/modernCases.js`
- Create: `src/components/ModernCaseSelector.jsx`
- Create: `src/components/ModernCaseDetail.jsx`
- Create: `src/pages/Modern.test.jsx`
- Modify: `src/pages/Modern.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `modernCases` 数组，每项包含 `id`、`number`、`title`、`summary`、`source`、`elements`、`application` 和 `concept`。
- Produces: `Modern` 页面，点击案例按钮后更新选中状态并调用详情区 `scrollIntoView`。

- [ ] **Step 1: 写失败测试**

```jsx
it('switches from architecture to daily life and reveals its four-part detail', () => {
  render(<Modern />)
  fireEvent.click(screen.getByRole('button', { name: '02 日常新生' }))
  expect(screen.getByRole('heading', { name: '日常新生' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '传统来源' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '嵌瓷元素提取' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '现代设计应用' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '设计说明' })).toBeInTheDocument()
})
```

- [ ] **Step 2: 验证测试因旧页面缺少案例按钮而失败**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: FAIL，无法找到“02 日常新生”按钮。

- [ ] **Step 3: 实现最小页面结构和状态切换**

```jsx
const [activeCase, setActiveCase] = useState(modernCases[0])

function selectCase(item) {
  setActiveCase(item)
  detailRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
}
```

- [ ] **Step 4: 添加 Modern 专属展陈样式并运行定向测试**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: PASS。

- [ ] **Step 5: 运行全量验证**

Run: `npm test -- --run`

Expected: 现有测试和 Modern 测试全部通过。

Run: `npm run build`

Expected: Vite 构建成功。

- [ ] **Step 6: 提交**

```bash
git add docs/superpowers/specs/2026-07-31-modern-page-design.md docs/superpowers/plans/2026-07-31-modern-page.md src/pages/Modern.jsx src/pages/Modern.test.jsx src/components/ModernCaseSelector.jsx src/components/ModernCaseDetail.jsx src/data/modernCases.js src/styles.css
git commit -m "v0.3 潮艺新生页面初版"
```
