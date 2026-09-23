# RULE.md — GPUIX UI edit rules

These are the working rules for this repo (`zeron-gpuix`). Follow them unless the user explicitly asks otherwise.

## 1. Mission

Recreate Zeron's desktop shell (formerly Comet) in GPUIX/React with pixel-level parity. The sibling `../zeron` repo is the source of truth for geometry, tone names, and component anatomy:

- Colors/tokens: `../zeron/crates/theme/src/builtins.rs`, `../zeron/crates/theme/src/lib.rs`, `../zeron/crates/ui/src/theme.rs`
- Sidebar/titlebar/shell: `../zeron/crates/ui/src/shell.rs`, `shell/spaces.rs`
- Composer: `../zeron/crates/ui/src/composer.rs`, `composer_dock.rs`
- Transcript/markdown: `../zeron/crates/ui/src/transcript.rs`, `markdown/render.rs`
- Changes/diffs/PR badges: `../zeron/crates/ui/src/changes.rs`, `change_requests.rs`

Rule from Zeron: **numbers drive layout, colors are paint.**

## 2. Default working style

- Make the smallest edit that satisfies the request. Do not refactor nearby code.
- Do not touch unrelated files, unrelated fixtures, screenshots, docs, lockfiles, or probe scripts.
- Preserve existing user changes. This repo often has a dirty working tree; never "clean" it.
- Prefer existing tokens/components over new literals: `C.*`, `SIDEBAR_WIDTH`, `COMPOSER_*`, `TEXT_*`, `TRANSITION`, `POPOVER_TRANSITION`.
- If a new literal is unavoidable, keep it local and name the reason in a short comment.
- Match GPUIX constraints: `motion` animates numeric/layout props only (`width`, `height`, `opacity`, offsets, `borderRadius`). Do not request color/transform tweens unless the renderer supports them.

## 3. When the user asks for a UI/color change

1. Identify the exact surface first: app root, titlebar, sidebar, content/home card, composer hero/dock, changes pane, settings, transcript.
2. Decide whether the change is token-wide or component-local:
   - Token-wide: edit `src/theme.ts` seeds/`C` only when the whole app should shift.
   - Component-local: edit the component's `style` prop directly.
3. Keep borders/hairlines intentional. Know where separation comes from:
   - titlebar/sidebar shell tone vs content/home `C.background`
   - `ContentCard` left border separates sidebar from content below the titlebar
   - titlebar should not invent its own seam unless asked
4. For "connected"/"seamless" requests, remove hairlines and match backgrounds across the boundary. For "match home", use `C.background`. For "part of sidebar", use `C.shell`.
5. After palette changes, remember `bun run audit` is pinned to Zeron's old reference pixels. Intentional visual divergence will make audit fail; do not run it as validation unless the user wants audit updated too.

## 4. Theme system

Themes live in `src/themes.ts` (seeds ported from `../zeron/crates/theme/src/builtins.rs`). `src/theme.ts` resolves the active seed into `C`/`ANSI`; `applyTheme(id)` mutates those exports before React state flips, so function components re-render with the new values. Avoid module-level captures of `C` � compute per render (see `transcript.tsx` `mdTheme()`).

Boot default is Dark+ (`vscode-dark-plus`). Required references are included: Zeron Dark (upstream default) and Dark+. Current set is 5 dark + 5 light: Zeron Dark/Light, Dark+/Light+, Catppuccin Mocha/Latte, Tokyo Night/Light, GitHub Dark/Light.

Semantic hue names stay meaningful: indigo/Zeron accent, red danger, amber warning, emerald success, plus project monograms slate/blue/violet/rose/amber/emerald/teal/orange.
## 5. Mock / no-mock mode

There is an App-level `mockData` state surfaced at Settings → Appearance → **Mock data**.

Expected behavior:

- ON: show fixtures from `src/data.ts`, fake transcript replies, fake branch changes/diff, fake project/filter options, demo context meter.
- OFF: empty shell only. Clear pinned/sessions, titlebar session title/branch, transcript fixtures, fake send replies, branch/diff data, fake target-selector options; context meter reads 0.
- Toggling modes must clear/restore transcript state immediately so fixtures never leak into the empty shell.

Do not remove the UI shell in no-mock; remove fake data only.

## 6. Component notes

- `app.tsx` owns cross-pane state: sidebar open, changes open, settings open/section, mock mode, hero/dock composer state.
- `src/titlebar.tsx`: left cluster belongs to sidebar when expanded (`C.shell`, width `SIDEBAR_WIDTH`); collapsed left cluster is just the sidebar-open button (`38px`). The remaining titlebar uses home `C.background`.
- `src/sidebar.tsx`: rows use `Session` fixtures; empty arrays must render cleanly. Space filter options must respect mock mode.
- `src/composer.tsx`: hero card and docked pill share tokens but different geometry. Hero lift is controlled in `app.tsx` (`heroTop`). Context meter is fake unless mock mode is on.
- `src/changes.tsx`: branch name, summary, file rows, and `<diff>` are fixtures; no-mock shows an empty changes state.
- `src/settings.tsx`: Appearance is where display/data toggles live. Reuse the existing `Toggle` and card row pattern.

## 7. Validation

Use:

```bash
Set-Location zeron-gpuix; bun run typecheck
```

Known pre-existing failure: `_hover.ts` and `_hover-focused.ts` use `focusWindow`, which the current GPUIX action union rejects. If typecheck reports only those two, consider the edit type-clean. If anything in `app.tsx` or `src/*` appears, fix it.

Optional visual check: `bun run screenshot` if the user wants a capture; do not run it for tiny style-only edits unless asked.

## 8. Communication

- State the exact files changed and the visible effect.
- Mention intentional divergences from Zeron parity.
- Mention validation result and known unrelated failures.
- Do not claim a screenshot/audit/typecheck passed if it was not run.
