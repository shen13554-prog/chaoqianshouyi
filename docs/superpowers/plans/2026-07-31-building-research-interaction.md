# 建筑案例研究型交互 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/building` 的四张建筑图片升级为可点击、可切换、可再次点击关闭的研究型展示，并补全色彩、纹样、拼接结构三类分析内容。

**Architecture:** 建筑研究字段继续存放在 `architectureCase.sourceImages` 中；`Building` 持有当前建筑 id，并把状态与切换回调交给新建的 `BuildingResearchGallery`。共享 `ModernCaseDetail` 只新增可选 `sourceContent` 注入点，默认图片展示行为保持不变；元素提取卡片根据现有 `extractions` 中新增的 `items` 渲染结构化研究条目。

**Tech Stack:** React 18、Vite、Vitest、Testing Library、普通 CSS

## Global Constraints

- 仅增强 `/building` 页面，不修改导航、路由或其他案例。
- 保留现有米白宣纸背景、宋体、朱红细线、金色装饰和中式展陈布局。
- 继续使用 `/images/building/building_01.webp`、`building_02.png`、`building_03.png`、`building_04.png`。
- 不新增页面、外部素材、弹窗、复杂动画或具体历史断言。
- PC 端验收尺寸为 1280×720；不新增移动端工作。

## File Map

- Create: `src/components/BuildingResearchGallery.jsx` — 建筑入口、选中状态和展开详情的纯展示组件。
- Modify: `src/pages/Building.jsx` — 持有 `activeBuildingId` 并处理选择、切换、关闭。
- Modify: `src/data/modernCases.js` — 增加建筑研究字段与提取条目。
- Modify: `src/components/ModernCaseDetail.jsx` — 增加 `sourceContent` 注入点并展示提取条目。
- Modify: `src/styles.css` — Building 专用入口、展开区和提取条目样式。
- Modify: `src/pages/Building.test.jsx` — 覆盖默认、展开、切换、关闭和提取内容。
- Verify: `src/pages/Modern.test.jsx` — 确认共享组件默认行为未回归。

---

### Task 1: 锁定建筑研究数据与交互行为

**Files:**
- Modify: `src/pages/Building.test.jsx`
- Modify: `src/data/modernCases.js`

**Interfaces:**
- Produces: `architectureCase.sourceImages[]`，每项包含 `id`、`src`、`name`、`type`、`location`、`meaning`。
- Produces: `architectureCase.extractions[].items[]`，每项包含 `label`、`meaning`，色彩项可选 `tone`。

- [ ] **Step 1: 写入默认状态和展开状态失败测试**

在 `Building.test.jsx` 引入 `fireEvent`，增加：

```jsx
it('opens a building research detail from the source gallery', () => {
  render(<Building />)

  expect(
    screen.queryByRole('region', { name: '安济王庙研究详情' }),
  ).not.toBeInTheDocument()

  const anjiCard = screen.getByRole('button', { name: '查看安济王庙研究详情' })
  fireEvent.click(anjiCard)

  expect(anjiCard).toHaveAttribute('aria-pressed', 'true')
  expect(
    screen.getByRole('region', { name: '安济王庙研究详情' }),
  ).toBeInTheDocument()
  expect(screen.getByText('潮汕传统庙宇建筑')).toBeInTheDocument()
  expect(screen.getByText('屋脊、檐部与正立面装饰区域')).toBeInTheDocument()
  expect(
    screen.getByText('通过瑞兽、花鸟等装饰语言表达守护、祈福与地方文化认同'),
  ).toBeInTheDocument()
})
```

- [ ] **Step 2: 写入切换与关闭失败测试**

```jsx
it('switches building details and closes the active building on a second click', () => {
  render(<Building />)

  fireEvent.click(screen.getByRole('button', { name: '查看安济王庙研究详情' }))
  fireEvent.click(screen.getByRole('button', { name: '查看观音庙研究详情' }))

  expect(
    screen.queryByRole('region', { name: '安济王庙研究详情' }),
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('region', { name: '观音庙研究详情' }),
  ).toBeInTheDocument()
  expect(screen.getByText('潮汕传统信仰建筑')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: '关闭观音庙研究详情' }))
  expect(
    screen.queryByRole('region', { name: '观音庙研究详情' }),
  ).not.toBeInTheDocument()
})
```

- [ ] **Step 3: 运行测试并确认 RED**

Run: `npm test -- --run src/pages/Building.test.jsx`

Expected: FAIL，因为页面尚无建筑按钮和研究详情区域。

- [ ] **Step 4: 增加四座建筑研究字段**

将 `architectureCase.sourceImages` 改为以下字段结构，现有路径保持不变：

```js
sourceImages: [
  {
    id: 'anji-wangmiao',
    src: '/images/building/building_01.webp',
    name: '安济王庙',
    type: '潮汕传统庙宇建筑',
    location: '屋脊、檐部与正立面装饰区域',
    meaning: '通过瑞兽、花鸟等装饰语言表达守护、祈福与地方文化认同',
  },
  {
    id: 'guangji-tianhou',
    src: '/images/building/building_02.png',
    name: '广济楼天后宫',
    type: '宫庙式公共文化建筑',
    location: '屋脊、山墙及入口上方装饰区域',
    meaning: '以海洋信仰相关意象和吉祥纹样寄托平安、顺遂与共同体愿望',
  },
  {
    id: 'guanyin-temple',
    src: '/images/building/building_03.png',
    name: '观音庙',
    type: '潮汕传统信仰建筑',
    location: '屋脊、檐口及墙面重点装饰区域',
    meaning: '借助花鸟、祥云等视觉元素传达慈佑、安宁与吉祥愿景',
  },
  {
    id: 'congxi-ancestral-hall',
    src: '/images/building/building_04.png',
    name: '从熙公祠',
    type: '潮汕传统祠堂建筑',
    location: '屋脊、山墙与门楼装饰区域',
    meaning: '通过礼序化构图和吉祥题材表达宗族记忆、家族延续与人文秩序',
  },
]
```

- [ ] **Step 5: 保持测试为 RED**

Run: `npm test -- --run src/pages/Building.test.jsx`

Expected: 仍 FAIL，失败原因从缺少数据收敛为缺少交互组件。

---

### Task 2: 实现建筑卡片展开、切换与关闭

**Files:**
- Create: `src/components/BuildingResearchGallery.jsx`
- Modify: `src/pages/Building.jsx`
- Modify: `src/components/ModernCaseDetail.jsx`
- Test: `src/pages/Building.test.jsx`
- Verify: `src/pages/Modern.test.jsx`

**Interfaces:**
- Consumes: `BuildingResearchGallery({ images, activeId, onToggle })`。
- Consumes: `onToggle(id: string): void`。
- Produces: `ModernCaseDetail({ sourceContent })` 可选 React 节点；未传入时继续使用原 `SourceGallery`。

- [ ] **Step 1: 创建纯展示组件**

新增 `BuildingResearchGallery.jsx`：

```jsx
export default function BuildingResearchGallery({ images, activeId, onToggle }) {
  const activeBuilding = images.find((image) => image.id === activeId) ?? null

  return (
    <section className="building-research" aria-labelledby="building-cases-title">
      <div className="building-research__heading">
        <p>ARCHITECTURE CASES</p>
        <h4 id="building-cases-title">建筑案例</h4>
      </div>

      <div className="modern-source-gallery building-research__grid">
        {images.map((image) => {
          const isActive = image.id === activeId

          return (
            <button
              type="button"
              className={isActive ? 'building-research-card is-active' : 'building-research-card'}
              aria-label={`${isActive ? '关闭' : '查看'}${image.name}研究详情`}
              aria-pressed={isActive}
              aria-expanded={isActive}
              aria-controls="building-research-detail"
              key={image.id}
              onClick={() => onToggle(image.id)}
            >
              <figure>
                <img src={image.src} alt={image.name} />
                <figcaption>{image.name}</figcaption>
              </figure>
            </button>
          )
        })}
      </div>

      {activeBuilding ? (
        <section
          className="building-research-detail"
          id="building-research-detail"
          aria-label={`${activeBuilding.name}研究详情`}
        >
          <div className="building-research-detail__image">
            <img src={activeBuilding.src} alt={`${activeBuilding.name}建筑放大展示`} />
          </div>
          <div className="building-research-detail__copy">
            <p>ARCHITECTURE RESEARCH</p>
            <h4>{activeBuilding.name}</h4>
            <dl>
              <div><dt>建筑类型</dt><dd>{activeBuilding.type}</dd></div>
              <div><dt>嵌瓷应用位置</dt><dd>{activeBuilding.location}</dd></div>
              <div><dt>文化寓意</dt><dd>{activeBuilding.meaning}</dd></div>
            </dl>
          </div>
        </section>
      ) : null}
    </section>
  )
}
```

- [ ] **Step 2: 在 Building 中持有切换状态**

```jsx
import { useState } from 'react'
import BuildingResearchGallery from '../components/BuildingResearchGallery'

const [activeBuildingId, setActiveBuildingId] = useState(null)
const handleBuildingToggle = (buildingId) => {
  setActiveBuildingId((currentId) => (
    currentId === buildingId ? null : buildingId
  ))
}
```

将以下节点传给 `ModernCaseDetail`：

```jsx
sourceContent={(
  <BuildingResearchGallery
    images={architectureCase.sourceImages}
    activeId={activeBuildingId}
    onToggle={handleBuildingToggle}
  />
)}
```

- [ ] **Step 3: 为共享详情组件增加兼容注入点**

在 `ModernCaseDetail` 参数中增加 `sourceContent`，来源内容按以下优先级渲染：

```jsx
{sourceContent ?? (
  item.sourceImages?.length
    ? <SourceGallery images={item.sourceImages} />
    : <ExhibitPlaceholder label="传统作品展示" />
)}
```

默认值保持 `undefined`，不改变 `/modern` 调用。

- [ ] **Step 4: 运行交互测试并确认 GREEN**

Run: `npm test -- --run src/pages/Building.test.jsx src/pages/Modern.test.jsx`

Expected: Building 展开、切换、关闭测试通过；Modern 原有 3 个测试继续通过。

---

### Task 3: 补全三类元素提取研究条目

**Files:**
- Modify: `src/pages/Building.test.jsx`
- Modify: `src/data/modernCases.js`
- Modify: `src/components/ModernCaseDetail.jsx`

**Interfaces:**
- Produces: `ExtractionGallery` 在 `extraction.items` 存在时渲染 `<ul className="modern-extraction-list">`。
- Item shape: `{ label: string, meaning: string, tone?: 'vermilion' | 'glaze-green' | 'gold' }`。

- [ ] **Step 1: 写入提取条目失败测试**

```jsx
it('presents the color, motif, and joining research items', () => {
  render(<Building />)

  ;[
    '朱红', '釉绿', '金色',
    '龙凤', '花鸟', '卷草纹',
    '瓷片排列方式', '层叠关系', '高低起伏结构',
  ].forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  expect(screen.getByText('关联礼制、喜庆与建筑视觉焦点。')).toBeInTheDocument()
  expect(screen.getByText('依据轮廓方向组织碎片，形成连续边界和视觉走势。')).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行测试并确认 RED**

Run: `npm test -- --run src/pages/Building.test.jsx`

Expected: FAIL，因为提取项尚未写入数据和 DOM。

- [ ] **Step 3: 在提取数据中增加 items**

为三个 `extractions` 对象分别增加：

```js
items: [
  { label: '朱红', meaning: '关联礼制、喜庆与建筑视觉焦点。', tone: 'vermilion' },
  { label: '釉绿', meaning: '连接自然、生机与传统彩瓷的釉色特征。', tone: 'glaze-green' },
  { label: '金色', meaning: '强化庄重、光泽与重要装饰部位的层级。', tone: 'gold' },
]
```

```js
items: [
  { label: '龙凤', meaning: '表达祥瑞、秩序与祝愿。' },
  { label: '花鸟', meaning: '连接自然生命、繁盛与日常审美。' },
  { label: '卷草纹', meaning: '通过连续曲线形成延展、连接与装饰节奏。' },
]
```

```js
items: [
  { label: '瓷片排列方式', meaning: '依据轮廓方向组织碎片，形成连续边界和视觉走势。' },
  { label: '层叠关系', meaning: '以前后覆盖建立纹样层次和局部厚度。' },
  { label: '高低起伏结构', meaning: '通过不同高度塑造立体明暗和远近关系。' },
]
```

- [ ] **Step 4: 渲染结构化提取条目**

在 `ExtractionGallery` 的说明后增加：

```jsx
{extraction.items?.length ? (
  <ul className="modern-extraction-list">
    {extraction.items.map((entry) => (
      <li key={entry.label}>
        {entry.tone ? (
          <span
            className={`modern-extraction-swatch modern-extraction-swatch--${entry.tone}`}
            aria-hidden="true"
          />
        ) : null}
        <div>
          <strong>{entry.label}</strong>
          <span>{entry.meaning}</span>
        </div>
      </li>
    ))}
  </ul>
) : (
  <ExhibitPlaceholder label={extraction.title} />
)}
```

移除同一位置原本无条件渲染的占位区域；没有 `items` 的旧数据仍使用占位区域。

- [ ] **Step 5: 运行测试并确认 GREEN**

Run: `npm test -- --run src/pages/Building.test.jsx src/pages/Modern.test.jsx`

Expected: 两个测试文件全部通过。

---

### Task 4: 匹配现有展陈视觉并完成验证

**Files:**
- Modify: `src/styles.css`
- Verify: `src/pages/Building.test.jsx`
- Verify: `src/pages/Modern.test.jsx`
- Verify: `src/App.test.jsx`

**Interfaces:**
- Consumes: Task 2 的 `.building-research*` 类名。
- Consumes: Task 3 的 `.modern-extraction-list` 与 `.modern-extraction-swatch*` 类名。

- [ ] **Step 1: 增加最小 Building 专用样式**

样式要求：

```css
.building-research__heading {
  padding: 0 0 28px;
}

.building-research__heading > p,
.building-research-detail__copy > p {
  margin: 0;
  color: var(--vermilion);
  font-size: 12px;
  letter-spacing: 0.22em;
}

.building-research__heading h4 {
  margin: 16px 0 0;
  color: var(--ink);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.building-research-card {
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}

.building-research-card figure {
  height: 100%;
  border: 1px solid transparent;
}

.building-research-card.is-active figure,
.building-research-card:focus-visible figure {
  border-color: var(--vermilion);
}

.building-research-detail {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  margin-top: 1px;
  border: 1px solid var(--gold-soft);
}

.building-research-detail__image img {
  width: 100%;
  height: 100%;
  min-height: 440px;
  display: block;
  object-fit: contain;
  background: var(--paper);
}

.building-research-detail__copy {
  padding: 54px 48px;
  border-left: 1px solid var(--gold-soft);
}

.building-research-detail__copy h4 {
  margin: 18px 0 30px;
  color: var(--ink);
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.building-research-detail__copy dl,
.building-research-detail__copy dd {
  margin: 0;
}

.building-research-detail__copy dl > div {
  padding: 18px 0;
  border-top: 1px solid var(--gold-soft);
}

.building-research-detail__copy dt {
  margin-bottom: 8px;
  color: var(--brown);
  font-size: 13px;
  letter-spacing: 0.12em;
}

.building-research-detail__copy dd {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.modern-extraction-list {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--gold-soft);
}

.modern-extraction-list li {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--gold-soft);
}

.modern-extraction-list strong,
.modern-extraction-list span {
  display: block;
}

.modern-extraction-list strong {
  margin-bottom: 6px;
  color: var(--ink);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.modern-extraction-list div > span {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.75;
}

.modern-extraction-swatch {
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
  margin-top: 5px;
  border: 1px solid var(--gold-soft);
}

.modern-extraction-swatch--vermilion { background: var(--vermilion); }
.modern-extraction-swatch--glaze-green { background: #667c62; }
.modern-extraction-swatch--gold { background: #b89552; }
```

上述样式不增加阴影、圆角或动画。

- [ ] **Step 2: 运行完整自动化测试**

Run: `npm test -- --run`

Expected: 全部测试通过，无 React 警告。

- [ ] **Step 3: 运行生产构建**

Run: `npm run build`

Expected: Vite 构建成功，无错误。

- [ ] **Step 4: 执行 1280×720 浏览器验收**

验证路径：

1. 打开 `/building`，确认四张卡片两列显示、详情默认关闭。
2. 点击“安济王庙”，确认左侧大图、右侧三项研究信息和朱红选中状态。
3. 点击“观音庙”，确认详情切换且页面没有横向溢出。
4. 再次点击“观音庙”，确认详情关闭。
5. 检查三张提取卡片的九个研究条目。
6. 打开 `/modern`，切换“艺术跨界”，确认共享组件无回归。
7. 检查控制台 error/warn、图片 naturalWidth 和框架错误遮罩。

- [ ] **Step 5: 检查改动范围并提交**

Run: `git diff --check` and `git status --short`

Expected: 仅计划、建筑数据、Building 页面、Building 专用组件、共享兼容点、相关测试和样式发生变化。

```bash
git add docs/superpowers/plans/2026-07-31-building-research-interaction.md src/components/BuildingResearchGallery.jsx src/components/ModernCaseDetail.jsx src/data/modernCases.js src/pages/Building.jsx src/pages/Building.test.jsx src/styles.css
git commit -m "v0.8 建筑研究交互展示"
```
