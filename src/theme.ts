/**
 * Zeron design tokens — ported from comet/crates/ui + comet/crates/theme.
 *
 * Colors: the "Zeron Dark" built-in variant (crates/theme/src/builtins.rs
 * `zeron_dark()`) plus the derived surface tokens from `variant()`:
 *   hover/active  = white at 11%/18% alpha over the shell
 *   border        = white at 10%, strong at 18%
 *   wash(a)       = hsl(0 0% 92% / a) — Zeron's neutral overlay tint
 *
 * Numbers drive layout, colors are paint: every metric below mirrors a
 * constant in crates/ui (shell.rs sidebar constants, Theme spacing ladder).
 */

export const C = {
  // zeron_dark seeds, nudged to the Frosted composite: the real app renders
  // translucent surfaces over the desktop backdrop, so its planes read a touch
  // lighter and warmer than the raw opaque seeds (#060606 / #0d0d0d).
  background: '#0e0e11',
  shell: '#16161a',
  raised: '#343438',
  card: '#121215',
  text: '#e8e8ea',
  textMuted: '#a9a9ae',
  textFaint: '#85858a',
  accent: '#8b7cf6',
  danger: '#f87171',
  warning: '#facc15',
  success: '#34d399',
  terminalBg: '#090909',

  // Derived (variant() in builtins.rs, dark appearance)
  dialog: '#232327', // card.mix(raised, 0.18) over the lifted card
  overlay: '#2a2a2e', // card.mix(raised, 0.34) over the lifted card
  hover: '#ebebef1c', // border_tone(white) @ 11% — glass_hover / wash(0.11)
  selected: '#ebebef1c', // glass_selected_bg dark = wash(0.11)
  active: '#8b7cf62e', // accent @ 18%
  border: '#ffffff1a', // white @ 10%
  borderStrong: '#ffffff2e', // white @ 18%
  wash0: '#ebebeb00', // wash(0.0) — transparent rest state
  input: '#343438b8', // raised @ 72%

  // Sidebar-specific (shell.rs)
  bubble: '#26262a', // right-aligned user turn fill (app-screenshot.jpg)
  subline: '#a9a9ae80', // text_muted.opacity(0.5) — space/branch lines
  harnessTint: '#a9a9aecc', // harness icon = subline.opacity(0.8) ≈ muted @ 80%

  // Zeron glyph (three-tone asterisk mark)
  glyph: '#e2795b',

  // Syntax (zeron_dark syntax array)
  syntaxString: '#34d399',
  syntaxKeyword: '#8b7cf6',
  syntaxFunction: '#60a5fa',
}

// ── Metrics (crates/ui) ─────────────────────────────────────────────────────
// Theme spacing ladder
export const SPACE_SM = 8
export const SPACE_MD = 12
export const SPACE_LG = 16

// theme.rs
export const TITLEBAR_HEIGHT = 38
export const TITLEBAR_TOP_PAD = 4
export const STATUS_STRIP_HEIGHT = 24

// shell.rs sidebar constants
export const SIDEBAR_WIDTH = 280 // SIDEBAR_DEFAULT
export const SIDEBAR_LIST_GAP = 2
export const SIDEBAR_LIST_PAD_TOP = 4
export const SIDEBAR_SESSION_SLOT = 61 + SIDEBAR_LIST_GAP // detailed row budget
export const HARNESS_ICON = 13 // SIDEBAR_ACTIVE_HARNESS_ICON_SIZE
export const ROW_RADIUS = 10

// typography.rs ui_rems(): sizes in px at the default root
export const TEXT_XS = 11 // space label, branch, corner status/time
export const TEXT_SM = 13 // row title, UI body
export const TEXT_MD = 14 // UI controls, chips
export const TEXT_BODY = 15 // transcript + composer body
export const TEXT_XL = 16 // content header title

// transcript.rs
export const USER_LINE_HEIGHT = 22 // the user bubble's line box
export const USER_COLLAPSED_LINES = 5
export const ATT_THUMB_W = 112
export const ATT_THUMB_H = 80

// shell.rs chat_row_height(shows_branch, shows_pull_request)
export const ROW_H = 45 // label + title, no metadata line
export const ROW_H_BRANCH = 47 + 14 // 61
export const ROW_H_PR = 47 + 16 // 63
export const ROW_H_COMPACT = 29

// motion.rs / session-row.tsx: hover washes blend over 150ms
export const TRANSITION = { duration: 0.15, ease: 'easeOut' as const }
export const POPOVER_TRANSITION = { duration: 0.12, ease: 'easeOut' as const }
// motion.rs NEW_THREAD_TRANSITION: 420ms ease-out-quint (the hero→dock glide)
export const NEW_THREAD_TRANSITION: { duration: number; ease: [number, number, number, number] } = {
  duration: 0.42,
  ease: [0.22, 1.0, 0.36, 1.0],
}

// composer.rs hero (new-thread) vs dock (session) geometry. The blank canvas is
// always expanded; an established session is compact. Only GPUIX-animatable
// props (height / borderRadius / opacity) are driven by these numbers.
export const COMPOSER_MAX_WIDTH = 768 // COMPOSER_MAX_WIDTH (max-w-3xl)
export const COMPOSER_DOCK_HEIGHT = 48 // COMPACT_TOTAL_HEIGHT ≈ 49
export const COMPOSER_DOCK_RADIUS = 24 // pill
// composer.rs COMPOSER_MIN_HEIGHT = TEXTAREA_MIN(76) + ACTIONS_ROW(46) + border(2) = 124.
// The 76px empty-textarea floor is what makes the always-expanded new-chat card tall.
export const COMPOSER_HERO_HEIGHT = 124
export const COMPOSER_HERO_RADIUS = 26 // COMPOSER_RADIUS
// shell.rs new_thread_background_height: 72% of the viewport, capped at 760px.
export const NEW_THREAD_BACKGROUND_VIEWPORT_RATIO = 0.72
export const NEW_THREAD_BACKGROUND_MAX_HEIGHT = 760

export const FONT_SANS = typeof window === 'undefined' ? 'Helvetica' : 'IBM Plex Sans'
