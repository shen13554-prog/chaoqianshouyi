# 守艺传承谱系 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/inheritors` 的规则图片宫格替换为可点击、可键盘操作的 SVG 燕尾脊传承谱系与人物详情框架。

**Architecture:** 人物姓名、插画、节点位置和占位资料保存在独立数据模块；`InheritorLineage` 负责 SVG 路径、节点状态和详情渲染；页面文件只负责标题与组件组合。样式全部使用 `inheritor-` 前缀，避免影响其他页面。

**Tech Stack:** React 18、Vite、Vitest、Testing Library、普通 CSS、内联 SVG。

## Global Constraints

- 只修改 `/inheritors` 页面及其专属数据、组件、测试和样式。
- 不修改 Header、Footer、路由、其他页面和现有图片。
- 四位人物使用陈伟钦、卢芝高、许少鹏、许少雄及现有插画。
- 身份、传承年代、主要技艺、代表作品、传承贡献统一显示“待补充”。
- 保持米白宣纸背景、朱红点缀、金色细线和 PC 端 1280px 布局。

---

### Task 1: 人物数据与交互验收测试

**Files:**
- Create: `src/data/inheritors.js`
- Create: `src/pages/Inheritors.test.jsx`

**Interfaces:**
- Produces: `inheritors` 数组，每项包含 `id`、`name`、`image`、`position`、`marker`、`details`。
- Consumes: `/images/inheritors/*.png` 现有站内路径。

- [ ] **Step 1: 写失败测试**

测试必须验证标题和副标题、四个原生按钮、陈伟钦默认选中、点击许少雄后 `aria-pressed` 与详情姓名更新、五项“待补充”完整显示，以及四张图片路径正确。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/pages/Inheritors.test.jsx`

Expected: FAIL，因为当前页面仍使用 `BasicPage`，没有谱系按钮与详情区域。

- [ ] **Step 3: 创建最小数据模块**

使用以下稳定字段：

```js
export const inheritors = [
  {
    id: 'chen-weiqin',
    name: '陈伟钦',
    image: '/images/inheritors/chen_weiqin.png',
    position: { left: '12%', top: '54%' },
    marker: '一脉',
    details: {
      identity: '待补充',
      era: '待补充',
      skills: '待补充',
      works: '待补充',
      contribution: '待补充',
    },
  },
]
```

其余三项使用相同字段结构和各自插画路径。

### Task 2: SVG 谱系与人物详情组件

**Files:**
- Create: `src/components/InheritorLineage.jsx`
- Modify: `src/pages/Inheritors.jsx`
- Modify: `src/styles.css`
- Test: `src/pages/Inheritors.test.jsx`

**Interfaces:**
- Consumes: `inheritors` 数组。
- Produces: `<InheritorLineage />`，内部管理 `activeId`，默认值为第一项 ID。

- [ ] **Step 1: 实现燕尾脊路径与节点**

在 `viewBox="0 0 1200 420"` 的 SVG 中绘制一条无填充、金色描边的连续曲线。四个节点使用绝对定位的原生 `<button type="button">`，设置 `aria-pressed` 和人物姓名作为可访问名称；点击更新 `activeId`。原生按钮提供 Tab、Enter 和空格行为，不增加重复键盘处理。

- [ ] **Step 2: 实现详情区**

详情使用 `aria-live="polite"`，左侧渲染当前人物大图，右侧渲染姓名和以下键值：

```js
[
  ['身份', active.details.identity],
  ['传承年代', active.details.era],
  ['主要技艺', active.details.skills],
  ['代表作品', active.details.works],
  ['传承贡献', active.details.contribution],
]
```

- [ ] **Step 3: 替换页面组合**

`Inheritors.jsx` 保留 `.basic-page` 与 `.basic-page__heading` 结构，将标题更新为“守艺传承”，副标题更新为指定文案，并在标题下渲染 `<InheritorLineage />`。

- [ ] **Step 4: 添加专属样式**

仅添加 `.inheritor-*` 规则：路径舞台、金色 SVG 线、错落圆形头像、朱红选中态、低透明纹样、CSS 瓷片、左图右文详情和短暂淡入。不得修改现有公共选择器的属性。

- [ ] **Step 5: 运行页面测试与全站测试**

Run: `npm test -- --run src/pages/Inheritors.test.jsx src/App.test.jsx`

Expected: PASS；若 `App.test.jsx` 的 `/inheritors` 标题仍断言旧标题，只将该断言更新为“守艺传承”。

### Task 3: 视觉与构建验证

**Files:**
- Verify only: `/inheritors`

**Interfaces:**
- Consumes: 完成的页面与开发服务器。
- Produces: 测试和构建证据，不修改其他页面。

- [ ] **Step 1: 在 1280×720 检查页面**

确认四节点沿路径错落排布、无内容遮挡、第一节点高亮、四张人物图加载成功、详情左图右文层级清晰。

- [ ] **Step 2: 检查交互与键盘**

依次点击四节点，并用 Tab 聚焦、Enter/空格激活节点，确认 `aria-pressed` 和详情同步切换。

- [ ] **Step 3: 运行生产构建**

Run: `npm run build`

Expected: Vite 构建成功且无错误。

- [ ] **Step 4: 检查修改范围**

Run: `git status --short` 与 `git diff --check`

Expected: 仅出现本规格列出的传承人物相关文件、规格/计划文件及必要的 `App.test.jsx` 标题断言更新。
