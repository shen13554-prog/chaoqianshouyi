# Inheritor Card Directional Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 0.4-second direction-aware cross-slide transition to the existing inheritor detail pagination without changing content, layout, or pagination rules.

**Architecture:** Keep `activeId` as the single source of truth for the selected inheritor. During pagination only, store the outgoing inheritor and direction for 400ms, render outgoing and incoming cards in the same CSS grid area, then remove the outgoing card; direct portrait-node selection retains its current behavior.

**Tech Stack:** React state/effects, Vitest + Testing Library, ordinary CSS.

## Global Constraints

- Preserve the existing four-person data array, content, pagination boundaries, routes, and page structure.
- Previous page: outgoing card moves right and incoming card enters from the left.
- Next page: outgoing card moves left and incoming card enters from the right.
- The outgoing and incoming animations run simultaneously for exactly 0.4 seconds.
- Do not add dependencies or modify other pages.

---

### Task 1: Direction-aware inheritor detail transition

**Files:**
- Modify: `src/pages/Inheritors.test.jsx`
- Modify: `src/components/InheritorLineage.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `inheritors` array, `activeId`, `handleSelect(inheritorId)`, and the previous/next pagination controls.
- Produces: temporary transition state shaped as `{ direction: 'previous' | 'next', outgoing: Inheritor }`; CSS classes `is-exiting-to-left`, `is-exiting-to-right`, `is-entering-from-left`, and `is-entering-from-right`.

- [ ] **Step 1: Write the failing direction test**

Add a test that enables fake timers, renders `<Inheritors />`, clicks “下一页”, and asserts:

```jsx
const outgoing = screen.getByRole('region', {
  name: `${inheritors[0].name}人物档案`,
})
const incoming = screen.getByRole('region', {
  name: `${inheritors[1].name}人物档案`,
})

expect(outgoing).toHaveClass('is-exiting-to-left')
expect(outgoing).toHaveAttribute('aria-hidden', 'true')
expect(incoming).toHaveClass('is-entering-from-right')

act(() => vi.advanceTimersByTime(400))
expect(
  screen.queryByRole('region', {
    name: `${inheritors[0].name}人物档案`,
  }),
).not.toBeInTheDocument()
```

Then click “上一页” and assert the second person exits right while the first enters from the left.

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```powershell
npm run test -- --run src/pages/Inheritors.test.jsx
```

Expected: FAIL because the outgoing card is immediately removed and the directional classes do not exist.

- [ ] **Step 3: Add minimal transition state and cleanup**

In `InheritorLineage.jsx`, add:

```jsx
const [transition, setTransition] = useState(null)
const transitionTimerRef = useRef(null)

useEffect(() => () => {
  window.clearTimeout(transitionTimerRef.current)
}, [])
```

Update `handlePageChange(nextIndex)` to capture `activeInheritor` as `outgoing`, derive `previous` or `next`, select the new ID, and clear the transition after 400ms. Clear any existing timer before starting another transition.

- [ ] **Step 4: Render both cards in one stable layer**

Wrap the detail card in `.inheritor-detail-stage`. During `transition`, render the outgoing archive with `aria-hidden="true"`, no pagination controls, and the correct exit class. Render the selected archive with the opposite entry class, the existing `detailRef`, the existing content, and the existing pagination controls.

Keep the detail markup in one module-level `InheritorDetailCard` component so the duplicated transition layers cannot diverge in content or layout.

- [ ] **Step 5: Add the four 0.4-second CSS animations**

Use one stable grid layer:

```css
.inheritor-detail-stage {
  display: grid;
  margin-top: 84px;
  overflow: hidden;
}

.inheritor-detail-stage > .inheritor-detail {
  grid-area: 1 / 1;
  margin-top: 0;
}
```

Add directional keyframes with `animation-duration: 400ms`, combining horizontal `translateX(...)` and opacity. Use modest displacement so the existing restrained visual style remains unchanged outside the transition.

- [ ] **Step 6: Run the targeted test and verify GREEN**

Run:

```powershell
npm run test -- --run src/pages/Inheritors.test.jsx
```

Expected: all inheritor tests PASS, including pagination boundaries, node selection, scrolling/highlight behavior, and both animation directions.

- [ ] **Step 7: Verify the rendered interaction**

Open `http://127.0.0.1:4173/inheritors`, click “下一页” and “上一页”, and confirm:

- Both cards move simultaneously in the requested directions.
- The page height and detail-card position do not jump.
- The correct active portrait and boundary buttons remain synchronized.
- No relevant console errors or warnings appear.

- [ ] **Step 8: Run the production build**

Run:

```powershell
npm run build
```

Expected: Vite and the CloudBase fallback script complete successfully.

- [ ] **Step 9: Commit only the animation implementation**

```powershell
git add -- src/components/InheritorLineage.jsx src/pages/Inheritors.test.jsx src/styles.css
git commit -m "优化传承人物资料卡双向切换动画"
```
