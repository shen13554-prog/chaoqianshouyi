# 「建筑再生」传统来源图片接入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/modern` 案例 01“传统来源”原视觉位置展示四张建筑图片及名称。

**Architecture:** 为 `architecture` 数据增加 `sourceImages` 数组，详情组件依据该字段在原占位位置条件渲染两列图片列表；没有该字段的案例继续使用原占位框。图片原样复制到当前项目 `public/images/building/`，局部 CSS 只负责图片展陈布局。

**Tech Stack:** React、Vitest、Testing Library、普通 CSS

## Global Constraints

- 保持当前 `/modern` 页面模块顺序和三案例切换方式。
- 不修改案例 02、03 数据。
- 不修改图片名称、格式或内容。
- 保持米白、朱红、金色细线视觉风格。
- 不修改其他页面。

---

### Task 1: 接入建筑图片数据与条件展陈

**Files:**
- Copy: `E:/作品集/项目四/潮嵌素材文件/潮嵌素材文件/public/images/building/building-01.webp` → `public/images/building/building-01.webp`
- Copy: `E:/作品集/项目四/潮嵌素材文件/潮嵌素材文件/public/images/building/building-02.png` → `public/images/building/building-02.png`
- Copy: `E:/作品集/项目四/潮嵌素材文件/潮嵌素材文件/public/images/building/building-03.png` → `public/images/building/building-03.png`
- Copy: `E:/作品集/项目四/潮嵌素材文件/潮嵌素材文件/public/images/building/building-04.png` → `public/images/building/building-04.png`
- Modify: `src/data/modernCases.js`
- Modify: `src/components/ModernCaseDetail.jsx`
- Modify: `src/styles.css`
- Test: `src/pages/Modern.test.jsx`

**Interfaces:**
- Consumes: `item.sourceImages?: Array<{ src: string, name: string }>`。
- Produces: `ModernCaseDetail` 在 `sourceImages` 非空时渲染两列图片列表，否则渲染 `ExhibitPlaceholder`。

- [ ] **Step 1: 写入失败测试**

在 `src/pages/Modern.test.jsx` 增加：

```jsx
it('shows the four named source buildings for the architecture case', () => {
  render(<Modern />)

  const sourceImages = [
    ['安济王庙', '/images/building/building-01.webp'],
    ['广济楼天后宫', '/images/building/building-02.png'],
    ['观音庙', '/images/building/building-03.png'],
    ['从熙公祠', '/images/building/building-04.png'],
  ]

  sourceImages.forEach(([name, src]) => {
    expect(screen.getByRole('img', { name })).toHaveAttribute('src', src)
    expect(screen.getByText(name)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 运行针对性测试并确认失败**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: FAIL，因为案例 01 尚未渲染四张建筑图片。

- [ ] **Step 3: 原样复制四张素材**

使用 `Copy-Item -LiteralPath` 将四个源文件复制到当前项目 `public/images/building/`，文件名和格式保持不变。复制后分别比较源文件与目标文件的 SHA-256 哈希，预期每组完全一致。

- [ ] **Step 4: 增加 `sourceImages` 数据**

在 `architecture` 对象中增加：

```js
sourceImages: [
  { src: '/images/building/building-01.webp', name: '安济王庙' },
  { src: '/images/building/building-02.png', name: '广济楼天后宫' },
  { src: '/images/building/building-03.png', name: '观音庙' },
  { src: '/images/building/building-04.png', name: '从熙公祠' },
],
```

- [ ] **Step 5: 实现最小条件渲染**

在 `ModernCaseDetail.jsx` 增加：

```jsx
function SourceGallery({ images }) {
  return (
    <div className="modern-source-gallery" aria-label="传统建筑来源">
      {images.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.name} />
          <figcaption>{image.name}</figcaption>
        </figure>
      ))}
    </div>
  )
}
```

并将传统来源模块的占位框替换为：

```jsx
{item.sourceImages?.length
  ? <SourceGallery images={item.sourceImages} />
  : <ExhibitPlaceholder label="传统作品展示" />}
```

- [ ] **Step 6: 添加局部两列样式**

在 `src/styles.css` 增加 `.modern-source-gallery`、`figure`、`img`、`figcaption` 样式：两列网格、金色细边线、米白底色、深墨名称；图片使用 `aspect-ratio: 4 / 3` 与 `object-fit: cover`。

- [ ] **Step 7: 运行针对性测试并确认通过**

Run: `npm test -- --run src/pages/Modern.test.jsx`

Expected: 4 tests PASS。

- [ ] **Step 8: 运行完整验证**

Run: `npm test -- --run`

Expected: 全部测试通过。

Run: `npm run build`

Expected: Vite 生产构建成功。

- [ ] **Step 9: 浏览器验证**

打开 `http://127.0.0.1:4173/modern`，确认四图两列展示、名称正确、图片无加载失败、案例切换与自动滚动正常、页面无横向溢出、控制台无相关错误。

- [ ] **Step 10: 提交**

```bash
git add public/images/building/building-01.webp public/images/building/building-02.png public/images/building/building-03.png public/images/building/building-04.png src/data/modernCases.js src/components/ModernCaseDetail.jsx src/styles.css src/pages/Modern.test.jsx docs/superpowers/plans/2026-07-31-modern-architecture-images.md
git commit -m "v0.5 建筑再生传统来源图片接入"
```
