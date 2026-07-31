# 「建筑再生」传统来源图片接入设计

## 目标

在不改变 `/modern` 页面模块顺序、案例切换方式和整体视觉风格的前提下，将四张已整理的传统建筑图片接入案例 01「建筑再生」的“传统来源”模块。

## 素材映射

- `/images/building/building-01.webp`：安济王庙
- `/images/building/building-02.png`：广济楼天后宫
- `/images/building/building-03.png`：观音庙
- `/images/building/building-04.png`：从熙公祠

素材从 `E:/作品集/项目四/潮嵌素材文件/潮嵌素材文件/public/images/building/` 原样复制到当前项目的 `public/images/building/`。不修改图片内容、名称或格式。

## 数据设计

仅为 `modernCases.js` 中 `architecture` 案例增加 `sourceImages` 数组。每项包含 `src` 和 `name`，用于提供图片路径与建筑名称。案例 02、03 的数据保持不变。

## 组件兼容

`ModernCaseDetail.jsx` 保持四段详情结构不变。在“传统来源”原视觉位置进行条件渲染：

- 当案例存在 `sourceImages` 时，显示两列建筑图片列表，并在每张图片下方显示建筑名称。
- 当案例不存在 `sourceImages` 时，继续显示原有“传统作品展示”占位框。

因此案例 02、03 的现有展示不会改变。

## 视觉处理

新增样式仅作用于建筑图片列表：两列布局、米白底色、金色细边线、深墨色名称。图片使用 `object-fit: cover` 填充统一展陈画幅，不改变源文件。现有页面背景、字体、朱红强调、金色细线和其他模块样式均不调整。

## 验证标准

- 案例 01“传统来源”显示四张图片及对应名称。
- 图片路径均从 `/images/building/` 引用并正常加载。
- 案例 02、03 仍显示原占位结构。
- 三案例切换和自动滚动保持正常。
- 全量测试及 `npm run build` 通过。
- 浏览器中 `/modern` 无图片加载失败、布局溢出或相关控制台错误。
