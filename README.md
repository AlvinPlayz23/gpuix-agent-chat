# zeron-gpuix

Zeron's desktop shell, recreated in **GPUIX** (React → Zed's GPUI, no Electron, no web view).

Goal: pixel-level parity with the real app in [`../comet`](../comet) — first the sidebar
and transcript, then the rest of the window.

```
┌──────────────────────────────────────────────────────────────┐
│ ▢ ← → ＋        │ ✳ Build the Fieldnotes workspace  …  ▢       │  38px titlebar
├─────────────────┼────────────────────────────────────────────┤
│ All projects ⌄ ≡│                                            │
│ Pinned      ⌄   │        [ user turn bubble ] (right)        │
│  …session rows  │   ## Workspace scaffold …  <markdown>       │
│ Sessions    ⌄   │                                            │
│  …session rows  │                                            │
│ L Local only    │   [ 📎 Do anything…  ✳ claude-sonnet-4-6 ↑ ]│
└─────────────────┴────────────────────────────────────────────┘
   280px shell (0d0d0d)          content card (060606)
```

## Run

```bash
pnpm install        # install (pnpm)
bun run dev         # bun --hot app.tsx — save a file, the window remounts
```

Other tasks:

```bash
pnpm typecheck      # tsc --noEmit
bun run screenshot  # writes screenshots/zeron.png via the GPUIX automation API
```

`bun run screenshot` launches `app.tsx` as a child process, waits for the
`composer` test id, pauses the native motion clock, and lets the renderer write
the PNG — the same frames on every run, with no desktop compositing involved.

## Layout map — GPUIX ↔ comet

| This repo | Zeron source | Notes |
| --- | --- | --- |
| `src/theme.ts` | `crates/theme/src/builtins.rs` (`zeron_dark`) + `crates/ui/src/theme.rs` | Exact seeds; derived surface tokens (`hover` = white 11%, `border` = white 10%, `input` = `raised` @72%) |
| `src/sidebar.tsx` | `crates/ui/src/shell.rs` (`render_chat_row`, sidebar constants) | Row slot 61px + 2px gap, list pad-top 4, harness icon 13, title gap 8 |
| `src/composer.tsx` | `crates/ui/src/composer_dock.rs` | 48px pill, paperclip left, model chip + send button right |
| `app.tsx` | `crates/ui/src/shell.rs` (`render_sidebar`, titlebar) | 38px titlebar, 4px top pad, sidebar on the shell, content card with its own border |
| `src/icons.tsx` | `crates/ui/src/icons.rs` | Stroke icons from the GPUIX examples; the Zeron asterisk glyph is inline SVG |

Numbers drive layout, colors are paint — the same rule the Zeron `theme.rs` states.

### Session row anatomy (detailed mode)

1. **line 1** — `project @ device`, 11px at 50% muted, with the corner on the right:
   elapsed time for idle rows, `✓ Done` in `success`, `● Working` in the accent.
2. **line 2** — Zeron glyph (harness brand), project monogram (initial on 8% tint),
   then the 13px title.
3. **line 3** — branch icon + branch (11px, ellipsizing) and the PR badge pushed right.
   Structural: omitted when a row has neither branch nor PR.

Selected rows take `wash(0.11)`; hovering an unselected row takes the same wash.

## Fixtures

`src/data.ts` holds the sessions from `comet/docs/screenshots/sidebar-layout/detailed.png`
plus a synthetic transcript. There is no engine, no RPC, and no persistence yet —
sending a message appends a local turn.

## Next steps

- Window frost: native vibrancy/Acrylic and GPUIX `BackdropBlur` for floating surfaces.
- Horizontal session tabs, the spaces dropdown popover, and the archive affordance.
- Composer footer chips (workspace + branch) from the newer `app-screenshot.jpg` layout.
- `<virtual-list>` transcript once real sessions can run long.
- Geist font: bundle `geist-latin.woff2` and set `fontFamily`, so metrics match exactly.
- Wire the real engine (`crates/rpc`) instead of fixtures.
