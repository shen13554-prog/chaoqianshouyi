# Site Landscape Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将用户提供的山水 PNG 设置为所有路由共享、固定在视口底部且向上渐隐的唯一装饰背景。

**Architecture:** 把原图复制到 `src/assets/images/background/`，由 Vite 在 CSS `url()` 引用中处理构建路径。使用 `body::before` 作为独立 fixed 背景层，并让 `.site-shell` 保持在其上方，从而不增加 React 结构、不参与页面布局，也不拦截交互。

**Tech Stack:** React 18、Vite、普通 CSS

## Global Constraints

- 背景层透明度固定为 `0.14`，符合 `0.1–0.18` 的要求。
- 山水图是全站唯一装饰背景；`body` 只保留米白纯色底。
- 不修改 React 页面结构、路由、内容、组件布局或交互。
- 背景层必须设置 `pointer-events: none`。
- 桌面端和手机端均保持图片比例，以视口底部为视觉锚点。
- 不暂存或提交工作区中已有的 History、Process、Inheritors 或其他无关修改。

---

### Task 1: 接入唯一全局背景资源和样式

**Files:**
- Create: `src/assets/images/background/site_landscape.png`
- Modify: `src/styles.css:27-41,58-60`

**Interfaces:**
- Consumes: 用户提供的 `E:/设计竞赛/AIGC/素材网图/抠图/fDjOT838Y.png`
- Produces: 由所有路由共享的 `body::before` fixed 背景层

- [ ] **Step 1: 复制原始图片但不修改图片内容**

```powershell
New-Item -ItemType Directory -Force -Path 'src/assets/images/background'
Copy-Item -LiteralPath 'E:/设计竞赛/AIGC/素材网图/抠图/fDjOT838Y.png' -Destination 'src/assets/images/background/site_landscape.png'
```

验证源文件与目标文件哈希一致：

```powershell
Get-FileHash -Algorithm SHA256 'E:/设计竞赛/AIGC/素材网图/抠图/fDjOT838Y.png','src/assets/images/background/site_landscape.png'
```

Expected: 两个 SHA256 值完全一致。

- [ ] **Step 2: 将 body 背景改为纯米白底并添加 fixed 伪元素**

将现有 `body` 的多层渐变背景替换为：

```css
body {
  margin: 0;
  min-width: 1180px;
  min-height: 100vh;
  background: var(--paper);
}

body::before {
  position: fixed;
  z-index: 0;
  inset: 0;
  content: "";
  pointer-events: none;
  background-image: url("./assets/images/background/site_landscape.png");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  opacity: 0.14;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 18%, #000 72%, #000 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, transparent 18%, #000 72%, #000 100%);
}
```

让应用内容稳定显示在背景层上方：

```css
.site-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}
```

- [ ] **Step 3: 添加仅影响背景图片的手机端适配**

在 `src/styles.css` 末尾添加：

```css
@media (max-width: 767px) {
  body::before {
    background-size: auto 100%;
    background-position: center bottom;
  }
}
```

该规则不解除项目原有 `1180px` 页面最小宽度，只确保 fixed 背景在窄视口中保持纵向比例。

- [ ] **Step 4: 检查改动范围和 CSS 引用**

```powershell
git diff -- src/styles.css
git status --short
Select-String -Path 'src/styles.css' -Pattern 'site_landscape|pointer-events: none|opacity: 0.14'
```

Expected: 本功能只新增背景图片、修改 `src/styles.css`，既有未提交文件保持原状。

### Task 2: 构建验证

**Files:**
- Verify: `dist/`

**Interfaces:**
- Consumes: Task 1 的 CSS 和图片资源
- Produces: 包含哈希背景资源的 Vite 静态构建

- [ ] **Step 1: 运行生产构建**

```powershell
npm run build
```

Expected: Vite 构建退出码为 `0`，无 CSS 或资源解析错误。

- [ ] **Step 2: 确认构建产物包含背景资源**

```powershell
Get-ChildItem -Path 'dist/assets' -File | Where-Object { $_.Length -eq 4263619 }
```

Expected: `dist/assets` 中存在对应的哈希命名 PNG 文件。

- [ ] **Step 3: 最终范围检查**

```powershell
git status --short
git diff --check
```

Expected: 没有空白错误；不自动暂存或提交实现改动。
