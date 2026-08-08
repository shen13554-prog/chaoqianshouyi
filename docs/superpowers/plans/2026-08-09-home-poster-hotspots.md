# Home Poster Hotspots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为首页现有完整长海报增加七处悬停阅读热点、砖红连接线和自动隐藏的放大信息卡。

**Architecture:** 在 `Home.jsx` 中保存热点文案与百分比坐标，并用首页局部 `activeHotspot` 状态控制当前卡片。新增单一职责的 `PosterHotspot` 组件渲染热点、连接线与信息卡；CSS 只作用于文化介绍海报区域，不改变海报资源、尺寸或其他页面。

**Tech Stack:** React 18、React Testing Library、Vitest、Vite、普通 CSS

## Global Constraints

- 继续使用 `/images/intro/intro_scroll_poster.webp`，不修改、替换或裁切海报图片。
- 只修改首页、首页专用组件、首页测试和对应 CSS。
- 不引入第三方组件、动画或状态管理依赖。
- 信息卡内容只精简转录现有海报，不增加未经确认的历史断言。
- 米白背景、砖红连接线、金色边框和现有宋体体系保持一致。
- 不暂存或提交工作区中现有 History、Process、Inheritors 或其他无关修改。

---

### Task 1: 定义首页热点行为测试

**Files:**
- Create: `src/pages/Home.test.jsx`

**Interfaces:**
- Consumes: `Home` 默认导出组件、`MemoryRouter`
- Produces: 七个热点、悬停显示和移开隐藏的回归测试

- [ ] **Step 1: 创建失败测试**

```jsx
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home poster reading hotspots', () => {
  it('keeps the existing complete poster and exposes seven reading hotspots', () => {
    renderHome()

    expect(screen.getByAltText('潮汕嵌瓷文化介绍长图')).toHaveAttribute(
      'src',
      '/images/intro/intro_scroll_poster.webp',
    )
    expect(screen.getAllByTestId('poster-hotspot')).toHaveLength(7)
  })

  it('shows the matching information card on hover and hides it on leave', () => {
    renderHome()
    const hotspot = screen.getByLabelText('查看嵌瓷介绍')

    fireEvent.mouseEnter(hotspot)
    expect(screen.getByRole('status')).toHaveTextContent('嵌瓷介绍')
    expect(screen.getByRole('status')).toHaveTextContent('彩釉瓷片')

    fireEvent.mouseLeave(hotspot)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 运行测试并确认预期失败**

Run: `npm test -- --run src/pages/Home.test.jsx`

Expected: 测试因尚无 `poster-hotspot` 与信息卡而失败；现有海报路径断言通过。

### Task 2: 实现热点组件与首页数据

**Files:**
- Create: `src/components/PosterHotspot.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- `PosterHotspot({ hotspot, isActive, onActivate })`
- `hotspot`: `{ id, title, summary, points, side, area }`
- `area`: `{ left, top, width, height }`，值为 CSS 百分比字符串
- `onActivate(id: string | null): void`

- [ ] **Step 1: 创建最小热点组件**

```jsx
export default function PosterHotspot({ hotspot, isActive, onActivate }) {
  const { id, title, summary, points, side, area } = hotspot

  return (
    <div
      aria-label={`查看${title}`}
      className={`poster-hotspot poster-hotspot--${side}${isActive ? ' is-active' : ''}`}
      data-testid="poster-hotspot"
      role="button"
      style={area}
      onMouseEnter={() => onActivate(id)}
      onMouseLeave={() => onActivate(null)}
    >
      {isActive && (
        <>
          <span className="poster-hotspot__connector" aria-hidden="true" />
          <article className="poster-hotspot__card" role="status">
            <span>POSTER ARCHIVE</span>
            <h3>{title}</h3>
            <p>{summary}</p>
            <ul>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 在 Home 中加入七项精简转录数据**

在 `Home.jsx` 顶部导入 `useState` 和 `PosterHotspot`，并定义 `posterHotspots`。数据必须精确包含：

```jsx
const posterHotspots = [
  {
    id: 'introduction',
    title: '嵌瓷介绍',
    summary: '以彩釉瓷片剪裁、组合并嵌贴成建筑装饰图像。',
    points: ['又称聚饶、粘瓷、扣饶', '常见人物、花卉与飞禽走兽题材', '多用于屋顶、墙壁等区域'],
    side: 'left',
    area: { left: '1.8%', top: '10.5%', width: '32%', height: '8.5%' },
  },
  {
    id: 'process-introduction',
    title: '工艺介绍',
    summary: '从造型基础到瓷片嵌贴，以多道手工环节形成完整画面。',
    points: ['塑胚胎', '剪取瓷片', '镶嵌瓷片', '综合调整'],
    side: 'left',
    area: { left: '1.8%', top: '25.8%', width: '23%', height: '14.8%' },
  },
  {
    id: 'core-features',
    title: '核心特点',
    summary: '瓷片釉色与立体结构共同构成嵌瓷鲜明的视觉辨识度。',
    points: ['色彩绚丽', '质地坚固', '立体感强', '变废为宝'],
    side: 'left',
    area: { left: '1.8%', top: '42.2%', width: '23%', height: '12.5%' },
  },
  {
    id: 'regional-distribution',
    title: '地区分布',
    summary: '嵌瓷随地域文化形成不同的色彩、题材与装饰风格。',
    points: ['潮汕', '闽南', '台湾', '海南'],
    side: 'left',
    area: { left: '1.8%', top: '71%', width: '35%', height: '24%' },
  },
  {
    id: 'landmarks',
    title: '标志建筑',
    summary: '传统庙宇与祠堂屋脊集中呈现嵌瓷的建筑装饰语言。',
    points: ['安济王庙', '广济楼天后宫', '观音庙', '从熙公祠'],
    side: 'right',
    area: { left: '72.8%', top: '4.8%', width: '14.7%', height: '13%' },
  },
  {
    id: 'material-process',
    title: '材料制作流程',
    summary: '多种基础材料经过处理、配比与熟化，形成嵌贴所需灰浆。',
    points: ['贝壳灰与石灰', '细沙与浸泡稻草', '红糖浆', '草根粗灰'],
    side: 'right',
    area: { left: '77.5%', top: '20%', width: '11%', height: '41%' },
  },
  {
    id: 'craft-steps',
    title: '工艺步骤',
    summary: '海报以纵向图示呈现材料由处理到灰浆调和的连续步骤。',
    points: ['烧制与浸泡', '分次加入', '过滤与搅拌', '配比调和'],
    side: 'right',
    area: { left: '89%', top: '20%', width: '9.5%', height: '74%' },
  },
]
```

- [ ] **Step 3: 在海报容器内渲染热点**

在 `Home` 中增加 `const [activeHotspot, setActiveHotspot] = useState(null)`。保持现有 `<img>` 不变，并在其后渲染：

```jsx
{posterHotspots.map((hotspot) => (
  <PosterHotspot
    key={hotspot.id}
    hotspot={hotspot}
    isActive={activeHotspot === hotspot.id}
    onActivate={setActiveHotspot}
  />
))}
```

- [ ] **Step 4: 运行首页测试确认结构与交互通过**

Run: `npm test -- --run src/pages/Home.test.jsx`

Expected: `2 tests passed`。

### Task 3: 实现热点、连接线和信息卡视觉

**Files:**
- Modify: `src/styles.css` 中 `.culture-intro__poster` 附近

**Interfaces:**
- Consumes: Task 2 的 `poster-hotspot--left`、`poster-hotspot--right`、`is-active` 类名
- Produces: 不参与布局的绝对定位热点、连接线和放大信息卡

- [ ] **Step 1: 为海报建立定位上下文并保持原始图片布局**

```css
.culture-intro__poster {
  position: relative;
}

.culture-intro__poster > img {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 2: 添加热点和高亮状态**

```css
.poster-hotspot {
  position: absolute;
  z-index: 2;
  cursor: default;
  outline: 1px solid transparent;
  outline-offset: 3px;
}

.poster-hotspot.is-active {
  background: rgba(181, 151, 93, 0.08);
  outline-color: rgba(181, 151, 93, 0.62);
}
```

- [ ] **Step 3: 添加连接线并让其兼作鼠标移动桥梁**

```css
.poster-hotspot__connector {
  position: absolute;
  top: 50%;
  width: 26px;
  height: 1px;
  background: var(--vermilion);
}

.poster-hotspot__connector::after {
  position: absolute;
  top: -3px;
  width: 7px;
  height: 7px;
  content: "";
  border: 1px solid var(--gold);
  border-radius: 50%;
  background: var(--paper);
}

.poster-hotspot--left .poster-hotspot__connector {
  left: 100%;
}

.poster-hotspot--right .poster-hotspot__connector {
  right: 100%;
}
```

- [ ] **Step 4: 添加米白信息卡和短淡入动画**

```css
.poster-hotspot__card {
  position: absolute;
  z-index: 3;
  top: 50%;
  width: 310px;
  padding: 22px 24px;
  color: var(--brown);
  border: 1px solid var(--gold-soft);
  background: rgba(248, 243, 233, 0.97);
  box-shadow: 0 16px 42px rgba(68, 49, 31, 0.16);
  transform: translateY(-50%);
  animation: poster-card-in 180ms ease-out both;
}

.poster-hotspot--left .poster-hotspot__card {
  left: calc(100% + 26px);
}

.poster-hotspot--right .poster-hotspot__card {
  right: calc(100% + 26px);
}

@keyframes poster-card-in {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}
```

补充卡片内 `span`、`h3`、`p`、`ul`、`li` 的字号、行高、间距和朱红/金色层级，所有选择器限定在 `.poster-hotspot__card` 下。

- [ ] **Step 5: 运行首页测试与 CSS 检查**

Run: `npm test -- --run src/pages/Home.test.jsx`

Run: `git diff --check`

Expected: 首页测试通过且无空白错误。

### Task 4: 全量验证

**Files:**
- Verify: `src/pages/Home.jsx`
- Verify: `src/components/PosterHotspot.jsx`
- Verify: `src/pages/Home.test.jsx`
- Verify: `src/styles.css`

**Interfaces:**
- Consumes: Tasks 1–3 的完整首页热点实现
- Produces: 可构建、无其他页面回归的首页版本

- [ ] **Step 1: 运行完整测试套件**

Run: `npm test -- --run`

Expected: 所有测试文件与测试用例通过。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: Vite 构建退出码为 `0`，CloudBase 回退文件正常生成。

- [ ] **Step 3: 检查最终修改范围**

Run: `git status --short`

Run: `git diff --check`

Run: `git diff -- src/pages/Home.jsx src/components/PosterHotspot.jsx src/pages/Home.test.jsx src/styles.css`

Expected: 本功能只新增/修改首页相关文件；既有未提交 History、Process 和 process 图片保持原状，不自动提交实现改动。
