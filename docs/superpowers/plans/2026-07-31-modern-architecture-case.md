# 「建筑再生」案例内容完善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变 `/modern` 页面结构、交互和视觉的前提下，完善案例 01「建筑再生」的四段内容。

**Architecture:** 沿用现有 `modernCases` 数据驱动结构，仅更新 `architecture` 对象。`ModernCaseDetail` 继续消费相同的 `source`、`elements`、`application` 和 `concept` 字段，因此无需修改组件或 CSS。

**Tech Stack:** React、Vitest、Testing Library、普通 CSS

## Global Constraints

- 只修改案例 01 数据，不改变页面结构。
- 保留三个案例的 React 状态切换和自动滚动。
- 保留米白、朱红、金色细线视觉风格。
- 图片继续使用现有站内占位框，不添加外部图片。
- 案例 02 和案例 03 数据不变。

---

### Task 1: 完善「建筑再生」案例数据

**Files:**
- Modify: `src/pages/Modern.test.jsx`
- Modify: `src/data/modernCases.js`

**Interfaces:**
- Consumes: `Modern` 页面渲染 `modernCases[0]`，详情组件读取 `source`、`elements`、`application`、`concept`。
- Produces: 更新后的 `architecture` 案例内容；字段名称和数据形状保持不变。

- [ ] **Step 1: 写入失败测试**

在 `src/pages/Modern.test.jsx` 增加：

```jsx
it('presents the architectural source, extracted elements, application, and design concept', () => {
  render(<Modern />)

  expect(screen.getByText('潮州嵌瓷广泛应用于祠堂、庙宇与传统民居，以屋脊、山墙上的龙凤、花鸟等立体装饰寄托吉祥寓意。')).toBeInTheDocument()
  expect(screen.getByText('色彩｜低饱和朱红、釉绿与金色关系')).toBeInTheDocument()
  expect(screen.getByText('纹样｜龙凤、花鸟及卷草轮廓')).toBeInTheDocument()
  expect(screen.getByText('瓷片拼接结构｜碎片层叠、方向排列与高低起伏')).toBeInTheDocument()
  expect(screen.getByText('将传统色彩、纹样和瓷片拼接秩序转化为空间界面、导视系统与公共艺术语言。')).toBeInTheDocument()
  expect(screen.getByText('通过数字化提取与重组传统文化结构，使嵌瓷非遗元素进入现代设计语境，在延续文化识别的同时形成新的应用方式。')).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行针对性测试并确认失败**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: FAIL，因为旧案例数据不包含上述新文案。

- [ ] **Step 3: 最小化更新案例数据**

将 `src/data/modernCases.js` 中 `architecture` 对象更新为：

```js
{
  id: 'architecture',
  number: '01',
  title: '建筑再生',
  summary: '让屋脊上的装饰语言进入当代公共空间。',
  source: '潮州嵌瓷广泛应用于祠堂、庙宇与传统民居，以屋脊、山墙上的龙凤、花鸟等立体装饰寄托吉祥寓意。',
  elements: [
    '色彩｜低饱和朱红、釉绿与金色关系',
    '纹样｜龙凤、花鸟及卷草轮廓',
    '瓷片拼接结构｜碎片层叠、方向排列与高低起伏',
  ],
  application: '将传统色彩、纹样和瓷片拼接秩序转化为空间界面、导视系统与公共艺术语言。',
  concept: '通过数字化提取与重组传统文化结构，使嵌瓷非遗元素进入现代设计语境，在延续文化识别的同时形成新的应用方式。',
}
```

- [ ] **Step 4: 运行针对性测试并确认通过**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: 3 tests PASS。

- [ ] **Step 5: 运行完整验证**

Run: `npm test -- --run`

Expected: 全部测试通过。

Run: `npm run build`

Expected: Vite 生产构建成功。

- [ ] **Step 6: 浏览器验证**

打开 `http://127.0.0.1:4173/modern`，确认案例 01 四段新内容、三个案例按钮、自动滚动、站内占位框和既有视觉均正常，并确认控制台无相关错误。

- [ ] **Step 7: 提交并合并**

```bash
git add src/pages/Modern.test.jsx src/data/modernCases.js docs/superpowers/plans/2026-07-31-modern-architecture-case.md
git commit -m "v0.4 建筑再生案例内容完善"
git checkout main
git merge --ff-only codex/modern-architecture-case
```
