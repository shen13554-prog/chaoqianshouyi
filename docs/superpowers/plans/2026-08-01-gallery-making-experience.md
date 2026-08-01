# Gallery Making Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Gallery making-experience steps with the approved real-process sequence, strict local-image mapping, text-only states for unmapped steps, and a subtle image transition.

**Architecture:** Keep the existing `Gallery` component and its state model. Replace each step's `imageIndex` with an optional explicit `image` path so process images cannot be confused with category works; derive final-step images from the active category's first real work image. Render the media block only when the current step resolves to an image, while retaining the existing two-column display for image-bearing steps and a text-only modifier for unmapped steps.

**Tech Stack:** React, Vite, Vitest, Testing Library, ordinary CSS.

## Global Constraints

- Only modify the Gallery making-experience module and its tests/styles.
- Do not generate images, call external images, add placeholders, or match unrelated images.
- Finished works may appear only in the final step and must come from the matching `half`, `stereo`, or `flat` category.
- `拼接纹样` and `排列纹样` remain text-only because no exact process image exists.
- Preserve Gallery layout, route, Header, Footer, and all other pages.
- Do not add third-party dependencies.

---

### Task 1: Lock the approved sequences and strict image rules in tests

**Files:**
- Modify: `src/pages/Gallery.test.jsx`

**Interfaces:**
- Consumes: the existing `Gallery` default export and accessible step buttons.
- Produces: regression coverage for step order, explicit process paths, final-work paths, text-only steps, and category reset behavior.

- [ ] **Step 1: Replace the obsolete making-step assertions and add failing mapping tests**

Add the following tests inside `describe('works gallery', ...)` and remove the obsolete expectations for `骨架塑形`, `添加瓷片`, `完成立体造型` and the old expectation that `拼接纹样` has an image:

```jsx
it('uses the approved half-inlay sequence and leaves the unmapped pattern step text-only', () => {
  render(<Gallery />)

  ;['选择瓷片', '拼接纹样', '嵌贴装饰', '完成作品'].forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeInTheDocument()
  })
  expect(screen.getByAltText('半浮嵌制作体验：选择瓷片')).toHaveAttribute(
    'src',
    '/images/process/sorting.webp',
  )

  fireEvent.click(screen.getByRole('button', { name: '拼接纹样' }))
  expect(screen.getByRole('heading', { name: '拼接纹样' })).toBeInTheDocument()
  expect(screen.queryByRole('img', { name: /半浮嵌制作体验/ })).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: '嵌贴装饰' }))
  expect(screen.getByAltText('半浮嵌制作体验：嵌贴装饰')).toHaveAttribute(
    'src',
    '/images/process/inlay.webp',
  )

  fireEvent.click(screen.getByRole('button', { name: '完成作品' }))
  expect(screen.getByAltText('半浮嵌制作体验：完成作品')).toHaveAttribute(
    'src',
    expect.stringContaining('/images/works/half/'),
  )
})

it('uses only process images before the final stereo-inlay step', () => {
  render(<Gallery />)
  fireEvent.click(screen.getByRole('button', { name: '立体嵌' }))

  const expected = [
    ['绘制草图', '/images/process/sketch.webp'],
    ['扎骨定形', '/images/process/frame.webp'],
    ['灰浆塑形', '/images/process/plaster.webp'],
    ['嵌入瓷片', '/images/process/inlay.webp'],
  ]
  expected.forEach(([title, path]) => {
    fireEvent.click(screen.getByRole('button', { name: title }))
    expect(screen.getByAltText(`立体嵌制作体验：${title}`)).toHaveAttribute('src', path)
  })

  fireEvent.click(screen.getByRole('button', { name: '完成造型' }))
  expect(screen.getByAltText('立体嵌制作体验：完成造型')).toHaveAttribute(
    'src',
    expect.stringContaining('/images/works/stereo/'),
  )
})

it('uses the approved flat-inlay sequence and leaves arrangement text-only', () => {
  render(<Gallery />)
  fireEvent.click(screen.getByRole('button', { name: '平嵌' }))

  fireEvent.click(screen.getByRole('button', { name: '分色选片' }))
  expect(screen.getByAltText('平嵌制作体验：分色选片')).toHaveAttribute(
    'src',
    '/images/process/sorting.webp',
  )
  fireEvent.click(screen.getByRole('button', { name: '剪修瓷片' }))
  expect(screen.getByAltText('平嵌制作体验：剪修瓷片')).toHaveAttribute(
    'src',
    '/images/process/trimming.webp',
  )
  fireEvent.click(screen.getByRole('button', { name: '排列纹样' }))
  expect(screen.queryByRole('img', { name: /平嵌制作体验/ })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '完成装饰' }))
  expect(screen.getByAltText('平嵌制作体验：完成装饰')).toHaveAttribute(
    'src',
    expect.stringContaining('/images/works/flat/'),
  )
})
```

- [ ] **Step 2: Run the focused tests and verify the new assertions fail**

Run:

```powershell
npm test -- --run src/pages/Gallery.test.jsx
```

Expected: FAIL because the current module has three obsolete steps per category, sources all visuals from category work images, and always renders an `<img>`.

- [ ] **Step 3: Commit the failing tests**

```powershell
git add src/pages/Gallery.test.jsx
git commit -m "test: define Gallery making experience rules"
```

---

### Task 2: Implement the approved process sequences and conditional media

**Files:**
- Modify: `src/pages/Gallery.jsx`
- Test: `src/pages/Gallery.test.jsx`

**Interfaces:**
- Consumes: `works[activeIndex].images[0]` as the matching category's final-step image.
- Produces: `makingExperiences[categoryName]` entries shaped as `{ title, description, image?: string, useFinishedWork?: boolean }` and a resolved `currentMakingImage: string | null`.

- [ ] **Step 1: Replace `makingExperiences` with the approved data**

Use this exact structure in `src/pages/Gallery.jsx`:

```jsx
const makingExperiences = {
  半浮嵌: [
    {
      title: '选择瓷片',
      description: '依照纹样色彩和浅浮雕轮廓，挑选釉色协调、厚薄适合的瓷片。',
      image: '/images/process/sorting.webp',
    },
    {
      title: '拼接纹样',
      description: '先按画面轮廓推演瓷片的方向与疏密关系，使纹样在浅层起伏中保持连贯。',
    },
    {
      title: '嵌贴装饰',
      description: '将选好的瓷片顺着灰塑底形逐片嵌贴，以排列方向强化纹样层次。',
      image: '/images/process/inlay.webp',
    },
    {
      title: '完成作品',
      description: '校正轮廓并补齐细节，使平面纹样与浅浮雕体量形成完整画面。',
      useFinishedWork: true,
    },
  ],
  立体嵌: [
    {
      title: '绘制草图',
      description: '根据题材绘制造型草图，确定作品姿态、比例与主要装饰区域。',
      image: '/images/process/sketch.webp',
    },
    {
      title: '扎骨定形',
      description: '依据草图扎制支撑骨架，为立体造型建立轮廓、体量与受力关系。',
      image: '/images/process/frame.webp',
    },
    {
      title: '灰浆塑形',
      description: '在骨架表面分层敷灰塑造形体，使主要结构与细部起伏逐步成形。',
      image: '/images/process/plaster.webp',
    },
    {
      title: '嵌入瓷片',
      description: '顺应立体表面的转折嵌入彩瓷，以色彩和排列强化结构层次。',
      image: '/images/process/inlay.webp',
    },
    {
      title: '完成造型',
      description: '整理连接处与外轮廓，使作品从不同角度保持完整清晰的形态。',
      useFinishedWork: true,
    },
  ],
  平嵌: [
    {
      title: '分色选片',
      description: '按照纹样的色彩区域挑选瓷片，兼顾釉色、尺寸与表面质感。',
      image: '/images/process/sorting.webp',
    },
    {
      title: '剪修瓷片',
      description: '依照线条和色块需要剪修瓷片，使边缘适合后续紧密排列。',
      image: '/images/process/trimming.webp',
    },
    {
      title: '排列纹样',
      description: '沿纹样走向安排瓷片的次序、方向与间距，逐步形成连续装饰。',
    },
    {
      title: '完成装饰',
      description: '补齐边缘和细部色块，使平整表面呈现清晰完整的纹样关系。',
      useFinishedWork: true,
    },
  ],
}
```

- [ ] **Step 2: Resolve final images strictly from the active category**

Immediately after `currentMakingStep`, add:

```jsx
const currentMakingImage = currentMakingStep.useFinishedWork
  ? activeCategory.images[0]
  : currentMakingStep.image ?? null
```

- [ ] **Step 3: Render media only when the current step has a permitted image**

Replace the making display with:

```jsx
<div
  className={`making-experience__display${currentMakingImage ? '' : ' is-text-only'}`}
>
  {currentMakingImage && (
    <div className="making-experience__media" key={currentMakingImage}>
      <img
        src={currentMakingImage}
        alt={`${activeCategory.name}制作体验：${currentMakingStep.title}`}
      />
    </div>
  )}
  <div className="making-experience__content">
    <p>
      步骤 {String(activeExperienceStep + 1).padStart(2, '0')} /{' '}
      {String(activeExperience.length).padStart(2, '0')}
    </p>
    <h3>{currentMakingStep.title}</h3>
    <span aria-hidden="true" />
    <p>{currentMakingStep.description}</p>
  </div>
</div>
```

- [ ] **Step 4: Run the focused tests and verify they pass**

Run:

```powershell
npm test -- --run src/pages/Gallery.test.jsx
```

Expected: all Gallery tests PASS.

- [ ] **Step 5: Commit the functional implementation**

```powershell
git add src/pages/Gallery.jsx src/pages/Gallery.test.jsx
git commit -m "feat: refine Gallery making experience steps"
```

---

### Task 3: Add the restrained image transition and verify the page

**Files:**
- Modify: `src/styles.css`
- Test: `src/pages/Gallery.test.jsx`

**Interfaces:**
- Consumes: `.making-experience__display.is-text-only` and the keyed `.making-experience__media` emitted by Task 2.
- Produces: a stable text-only layout and a local CSS-only fade/scale transition.

- [ ] **Step 1: Add a static class assertion for the text-only state**

In the half-inlay text-only test, after clicking `拼接纹样`, add:

```jsx
expect(
  screen.getByRole('heading', { name: '拼接纹样' }).closest('.making-experience__display'),
).toHaveClass('is-text-only')
```

- [ ] **Step 2: Run the focused test to verify it fails before the modifier is present**

Run:

```powershell
npm test -- --run src/pages/Gallery.test.jsx -t "leaves the unmapped pattern step text-only"
```

Expected: FAIL if Task 2 has not yet supplied the `is-text-only` modifier; otherwise PASS, confirming the interface is already present.

- [ ] **Step 3: Add only the local transition and text-only layout styles**

Append these rules beside the existing `.making-experience__display` and media rules in `src/styles.css`:

```css
.making-experience__display.is-text-only {
  grid-template-columns: 1fr;
}

.making-experience__display.is-text-only .making-experience__content {
  min-height: 310px;
  border-left: 1px solid var(--gold-soft);
}

.making-experience__media {
  animation: gallery-making-media-enter 360ms ease-out both;
}

@keyframes gallery-making-media-enter {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

- [ ] **Step 4: Run focused tests and the production build**

Run:

```powershell
npm test -- --run src/pages/Gallery.test.jsx
npm run build
```

Expected: all Gallery tests PASS and Vite production build exits with code 0.

- [ ] **Step 5: Inspect the final diff for scope violations**

Run:

```powershell
git diff -- src/pages/Gallery.jsx src/pages/Gallery.test.jsx src/styles.css
git status --short
```

Expected: changes trace only to the Gallery making-experience module; no Header, Footer, route, other page, or asset modification is introduced by this optimization.

- [ ] **Step 6: Commit the verified visual behavior**

```powershell
git add src/styles.css src/pages/Gallery.test.jsx
git commit -m "style: add Gallery process step transition"
```
