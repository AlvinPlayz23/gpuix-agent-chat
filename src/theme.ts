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
  // zeron_dark seeds
  background: '#060606',
  shell: '#0d0d0d',
  raised: '#343438',
  card: '#0e0e0e',
  text: '#e8e8ea',
  textMuted: '#a9a9ae',
  textFaint: '#85858a',
  accent: '#8b7cf6',
  danger: '#f87171',
  warning: '#facc15',
  success: '#34d399',
  terminalBg: '#090909',

  // Derived (variant() in builtins.rs, dark appearance)
  dialog: '#1e1e21', // card.mix(raised, 0.18)
  overlay: '#262629', // card.mix(raised, 0.34)
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

export const FONT_SANS = typeof window === 'undefined' ? 'Helvetica' : 'IBM Plex Sans'
