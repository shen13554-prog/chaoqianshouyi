# 潮州嵌瓷数字历史长卷 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/history` 从基础图片展示升级为可点击朝代节点、切换历史信息卡片并关联建筑案例的横向数字长卷。

**Architecture:** 使用独立数据文件保存历史节点，`HistoryScroll` 只负责横向轨道与鼠标节点，`HistoryDetailCard` 只负责当前节点信息与建筑入口，`History.jsx` 管理选中状态并复用现有页面标题视觉。所有样式采用 `history-` 前缀，避免影响其他路由。

**Tech Stack:** React 18、React Router、普通 CSS、Vitest、Testing Library。

## Global Constraints

- 保持 `/history` 路由不变。
- 展板仅作为视觉参考，不复制到 `public`，不直接放入网页。
- 保留米白、砖红、青绿色视觉系统和中式印章节点。
- 仅支持鼠标点击，不新增键盘事件处理。
- 继续使用 `/images/history/` 与现有建筑路由。
- 不修改其他页面或公共路由结构。

---

### Task 1: 历史数据与交互契约

**Files:**
- Create: `src/data/historyTimeline.js`
- Create: `src/pages/History.test.jsx`

**Interfaces:**
- Produces: `historyTimeline` 数组；每项包含 `id`、`period`、`year`、`title`、`summary`、`detail`、`image`、`imageAlt`，可选 `caseStudy`。
- Tests: 默认节点为殷商，节点列表完整，点击清代后详情与从熙公祠入口更新。

- [ ] **Step 1: 写失败测试**

测试渲染 `<History />` 后断言“殷商”详情默认显示；点击按钮“清代”后断言“祠堂与民居营建推动嵌瓷成熟”和“从熙公祠”链接出现，并确认节点数量为 10。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/pages/History.test.jsx`
Expected: FAIL，因为当前 `History` 仍是 `BasicPage` 图片展示。

- [ ] **Step 3: 建立数据文件**

按殷商、战国、宋代、明代、清代、民国、新中国成立后、20世纪50—70年代、1990年代、2008年顺序定义 10 个节点。清代 `caseStudy` 固定为 `{ name: '从熙公祠', to: '/building', image: '/images/building/building_04.png' }`。

### Task 2: 横向长卷与详情组件

**Files:**
- Create: `src/components/HistoryScroll.jsx`
- Create: `src/components/HistoryDetailCard.jsx`

**Interfaces:**
- `HistoryScroll({ items, activeId, onSelect })`：渲染横向轨道和 10 个鼠标按钮，点击调用 `onSelect(id)`。
- `HistoryDetailCard({ item })`：渲染时期、标题、正文、现有历史图片及可选建筑案例链接。

- [ ] **Step 1: 实现最小组件**

节点使用 `type="button"` 和 `aria-pressed`，不增加 `onKeyDown`、`tabIndex` 或键盘说明。轨道两侧使用朝代节点与小型历史图片交错排列。

- [ ] **Step 2: 运行测试确认组件契约通过**

Run: `npm test -- --run src/pages/History.test.jsx`
Expected: 仍可能因页面未组装失败，但组件可被 `History.jsx` 直接消费。

### Task 3: 历史页面组装与专属样式

**Files:**
- Modify: `src/pages/History.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- `History.jsx` 以 `useState(historyTimeline[0].id)` 管理当前节点，将同一 `activeItem` 传给详情卡片。
- CSS 仅新增 `.history-scroll-*`、`.history-seal-*`、`.history-detail-*`、`.history-case-*` 选择器。

- [ ] **Step 1: 替换基础图片展示**

保留 `basic-page` 与 `basic-page__heading` 结构和“潮嵌源流”标题，正文改为数字长卷、操作提示和详情卡片。

- [ ] **Step 2: 增加长卷视觉**

长卷外框 `overflow-x: auto`，内部轨道最小宽度约 `2200px`；金色路径、砖红活动印章、青绿色辅助节点；页面外层不得产生横向溢出。

- [ ] **Step 3: 实现信息卡片与建筑入口视觉**

详情卡片采用图片与正文双列；清代显示从熙公祠图片、名称和指向 `/building` 的“查看建筑案例”链接。

- [ ] **Step 4: 运行测试确认绿色**

Run: `npm test -- --run src/pages/History.test.jsx src/App.test.jsx`
Expected: PASS，且原路由标题断言继续通过。

### Task 4: 浏览器与构建验证

**Files:**
- No production file changes unless validation reveals an in-scope defect.

**Interfaces:**
- Browser flow: `/history` → 点击“清代” → 信息卡片更新 → 点击“2008年” → 国家级非遗信息更新。

- [ ] **Step 1: 浏览器检查**

确认页面非空、无 Vite 错误覆盖、控制台无错误、10 个节点存在、图片加载成功、点击状态唯一、长卷内部滚动且页面无额外横向溢出。

- [ ] **Step 2: 全量测试**

Run: `npm test -- --run`
Expected: 所有测试通过。

- [ ] **Step 3: 生产构建**

Run: `npm run build`
Expected: Vite 构建成功并生成 `dist/`，该目录保持忽略状态。

