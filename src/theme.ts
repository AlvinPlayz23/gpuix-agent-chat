/**
 * Zeron design tokens — the `zeron-dark` variant, transcribed from Zeron.
 *
 * Sources (all under ../zeron):
 *   crates/theme/src/builtins.rs       `zeron_dark()` seeds, `variant()` derivations
 *   crates/theme/src/lib.rs            Color::{mix, with_alpha, ensure_contrast,
 *                                      blend_over, best_on_color}, AccentRoles::derive
 *   crates/ui/src/theme.rs             ink()/hairline()/wash()/band()/scrim(),
 *                                      glass_hover(), glass_selected_bg(),
 *                                      card_selected_bg(), user_bubble_bg(),
 *                                      the radius + spacing ladder, GLASS_ALPHA
 *   crates/ui/src/composer.rs          pill metrics, composer_sidebar_tint(),
 *                                      the frost pill hairline
 *   crates/ui/src/shell.rs             sidebar/titlebar metrics, row washes + text ramps
 *   crates/ui/src/markdown/render.rs   MD_* metrics
 *   crates/ui/src/typography.rs        ui_rems() — 16px root
 *
 * `bun run audit` recomputes every derived token from the seeds with Zeron's own
 * math (theme-audit.ts) and fails on drift; that file also pins the composited
 * swatches measured off zeron/docs/screenshots and zeron/docs/reference.
 *
 * Numbers drive layout, colors are paint — the rule Zeron's theme.rs states.
 */

// ── zeron_dark seeds (builtins.rs `zeron_dark()`) ───────────────────────────
export const SEED = {
  background: '#171717', // main panel / transcript canvas — lifted off black
  shell: '#212123', // shell, sidebar, titlebar (the glass tint over the desktop)
  raised: '#3d3d42', // opaque pills/chips proud of the panel
  card: '#1b1b1d', // inline card resting on the main panel
  text: '#e8e8ea',
  muted: '#a9a9ae',
  faint: '#85858a',
  accent: '#8b7cf6',
  danger: '#f87171',
  warning: '#facc15',
  success: '#34d399',
  terminal: '#090909', // terminal palette background
} as const

// ── Color math (crates/theme/src/lib.rs `Color`) ────────────────────────────
// mix() lerps in sRGB per channel and rounds half away from zero; withAlpha()
// *replaces* the alpha (gpui's `Hsla::opacity` semantics — verified against the
// native fixture: a Claude mark painted at `tint.opacity(0.8)` composites to
// #b2/b3 over the #181818 sidebar, i.e. 0.8 of #d97757, not 0.8 * 0.5 of it).

interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

function parse(hex: string): Rgba {
  const value = hex.replace('#', '')
  const channel = (index: number) => parseInt(value.slice(index * 2, index * 2 + 2), 16)
  return {
    r: channel(0),
    g: channel(1),
    b: channel(2),
    a: value.length === 8 ? channel(3) : 255,
  }
}

function format(color: Rgba): string {
  const hex = (value: number) => value.toString(16).padStart(2, '0')
  const rgb = `#${hex(color.r)}${hex(color.g)}${hex(color.b)}`
  return color.a === 255 ? rgb : `${rgb}${hex(color.a)}`
}

/** `Color::mix` — linear per-channel lerp toward `to` by `amount`. */
export function mix(from: string, to: string, amount: number): string {
  const a = parse(from)
  const b = parse(to)
  const t = Math.min(1, Math.max(0, amount))
  const lerp = (x: number, y: number) => Math.round(x + (y - x) * t)
  return format({ r: lerp(a.r, b.r), g: lerp(a.g, b.g), b: lerp(a.b, b.b), a: lerp(a.a, b.a) })
}

/** `Color::with_alpha` / `Hsla::opacity` — replace the alpha, keep r/g/b. */
export function withAlpha(hex: string, alpha: number): string {
  return format({ ...parse(hex), a: Math.round(Math.min(1, Math.max(0, alpha)) * 255) })
}

/** `Color::blend_over` — source-over compositing, for measuring recipes. */
export function blendOver(front: string, back: string): string {
  const fg = parse(front)
  const bg = parse(back)
  const alpha = fg.a / 255
  const blend = (x: number, y: number) => Math.round(x * alpha + y * (1 - alpha))
  return format({ r: blend(fg.r, bg.r), g: blend(fg.g, bg.g), b: blend(fg.b, bg.b), a: 255 })
}

/** `wash(alpha)` — hsl(0 0% 92% / a): the state wash for chrome on glass. */
export function wash(alpha: number): string {
  return withAlpha('#ebebeb', alpha)
}

/** `ink(alpha)` — soft-white fill for chips and rows inside floating cards. */
export function ink(alpha: number): string {
  return withAlpha('#ffffff', alpha)
}

/** `hairline(alpha)` — border/divider/ring ink. Identical to `ink` in dark. */
export function hairline(alpha: number): string {
  return withAlpha('#ffffff', alpha)
}

// ── Resolved tokens ─────────────────────────────────────────────────────────
// Every value is either a seed or a derivation `builtins.rs variant()` /
// `ui/src/theme.rs from_variant()` performs; none is hand-tuned. The hex after
// each one is what `bun run audit` recomputes.
export const C = {
  // Surfaces
  background: SEED.background, // #060606 — main panel, transcript canvas
  shell: SEED.shell, // #0d0d0d — shell/sidebar/titlebar
  raised: SEED.raised, // #343438 — opaque pill/chip
  card: SEED.card, // #0e0e0e — inline card
  dialog: mix(SEED.card, SEED.raised, 0.18), // #151516 — modal
  overlay: mix(SEED.card, SEED.raised, 0.34), // #1b1b1c — popover/menu, top plane
  terminalBg: SEED.terminal, // #090909

  // State fills
  hover: withAlpha('#ffffff', 0.11), // #ffffff1c — element_hover = glass_hover()
  selected: wash(0.11), // #ebebeb1c — glass_selected_bg() = card_selected_bg()
  active: withAlpha(SEED.accent, 0.18), // #8b7cf62e — element_active
  border: hairline(0.1), // #ffffff1a
  borderStrong: hairline(0.18), // #ffffff2e
  ring: hairline(0.09), // #ffffff17 — inset selection ring
  wash0: wash(0), // #ebebeb00 — transparent rest state
  band: withAlpha('#ffffff', 0.11), // #ffffff1c — theme.band
  input: withAlpha(SEED.raised, 0.72), // #343438b8 — colors.input
  scrim: '#00000099', // scrim(SCRIM_ALPHA_DARK) — 60% black backdrop

  // Text
  text: SEED.text, // #e8e8ea — ~17.5:1 on its own plane
  textMuted: SEED.muted, // #a9a9ae
  textFaint: SEED.faint, // #85858a
  textDim: SEED.muted, // #a9a9ae — from_variant maps text_dim onto text_muted
  textBody: withAlpha(SEED.text, 0.8), // #e8e8eacc — session-row title at rest
  textArchived: withAlpha(SEED.text, 0.55), // #e8e8ea8c — archived row title
  subline: withAlpha(SEED.muted, 0.5), // #a9a9ae80 — space/branch/corner lines
  harnessTint: withAlpha(SEED.muted, 0.8), // #a9a9aecc — harness mark on the surface

  // Accent — AccentRoles::derive(#8b7cf6, dark, #060606)
  accent: SEED.accent, // #8b7cf6
  accentStrong: SEED.accent, // #8b7cf6 (black beats 4.5:1 on it, so no shift)
  accentWash: withAlpha(SEED.accent, 0.22), // #8b7cf638
  onAccent: '#000000', // best_on_color(#8b7cf6)
  selection: withAlpha(SEED.accent, 0.35), // #8b7cf659 — text selection
  caret: SEED.accent,
  glyphLight: mix(SEED.accent, '#ffffff', 0.28), // #aba1f9
  glyphMid: SEED.accent, // #8b7cf6
  glyphDeep: mix(SEED.accent, '#000000', 0.18), // #7266ca
  codeText: SEED.accent,
  codeWash: withAlpha(SEED.accent, 0.22), // #8b7cf638 — inline-code chip

  // Status
  danger: SEED.danger, // #f87171
  dangerMuted: mix(SEED.danger, SEED.text, 0.28), // #f49293
  dangerStrong: SEED.danger,
  warning: SEED.warning, // #facc15
  warningMuted: mix(SEED.warning, SEED.text, 0.25), // #f6d34a
  success: SEED.success, // #34d399
  successMuted: mix(SEED.success, SEED.text, 0.25), // #61d8ad
  solid: '#ebebef', // max-contrast plate (primary buttons)
  onSolid: '#000000', // best_on_color(solid)
  cursor: withAlpha(SEED.text, 0.4), // #e8e8ea66 — terminal block cursor
  diffAdd: SEED.success,
  diffDel: SEED.danger,
  diffHunk: withAlpha(SEED.accent, 0.08), // #8b7cf614

  // Composer
  pill: '#00000026', // composer_sidebar_tint() resolves to black @ 15%
  pillBorder: '#bdc7d117', // hsla(210 18% 78% / 0.09) — the frost pill hairline

  // Transcript
  bubble: wash(0.08), // #ebebeb14 — user_bubble_bg()

  // Syntax (the zeron_dark syntax array, builtins.rs)
  syntaxComment: '#92929a',
  syntaxKeyword: '#8b7cf6',
  syntaxString: '#34d399',
  syntaxNumber: '#facc15',
  syntaxType: '#c084fc',
  syntaxFunction: '#60a5fa',
  syntaxProperty: '#f472b6',
  syntaxVariable: '#e8e8ea',
  syntaxPunctuation: '#a1a1aa',
  syntaxTag: '#f472b6',
  syntaxAttribute: '#22d3ee',
  syntaxInvalid: '#f87171',
}

/** ANSI_DARK — the zeron_dark terminal palette (builtins.rs). */
export const ANSI = [
  '#242424',
  '#f87171',
  '#4ade80',
  '#facc15',
  '#60a5fa',
  '#c084fc',
  '#22d3ee',
  '#d4d4d8',
  '#52525b',
  '#fca5a5',
  '#86efac',
  '#fde047',
  '#93c5fd',
  '#d8b4fe',
  '#67e8f9',
  '#fafafa',
] as const

// ── Metrics (crates/ui/src/theme.rs, shell.rs, composer.rs) ─────────────────
// The spacing ladder.
export const SPACE_XS = 4
export const SPACE_SM = 8
export const SPACE_MD = 12
export const SPACE_LG = 16
/** Optical gap for a coupled title/description stack — outside the ladder. */
export const TEXT_STACK_GAP = 1

// Radii (theme.rs + shell.rs render_chat_row + popover.rs)
export const BUBBLE_RADIUS = 16 // user turn bubble
export const PANEL_RADIUS = 10
export const CONTROL_RADIUS = 6 // buttons, chips
export const ROW_RADIUS = 8 // session row plating (shell.rs render_chat_row)
export const CARD_RADIUS = 12 // popover card (popover.rs)
export const CARD_INSET = 4
export const MENU_ITEM_RADIUS = CARD_RADIUS - CARD_INSET // 8
export const PALETTE_ITEM_RADIUS = 14 - CARD_INSET // 10
export const MENU_GAP = 2

// Window chrome (theme.rs)
export const TITLEBAR_HEIGHT = 38
export const TITLEBAR_TOP_PAD = 4
export const HEADER_HEIGHT = 44 // in-card header (h-11)
export const STATUS_STRIP_HEIGHT = 24 // reserved WorkingIndicator row (h-6)
export const TRANSCRIPT_FADE_BAND = 24 // bottom gradient over the transcript

// Sidebar (shell.rs sidebar constants)
export const SIDEBAR_WIDTH = 280 // settings SIDEBAR_DEFAULT
export const SIDEBAR_LIST_GAP = 2
export const SIDEBAR_LIST_PAD_TOP = 4
export const SIDEBAR_SESSION_SLOT = 61 + SIDEBAR_LIST_GAP // detailed row budget
export const HARNESS_ICON = 13 // SIDEBAR_ACTIVE_HARNESS_ICON_SIZE
export const HARNESS_TITLE_GAP = SPACE_SM
export const ROW_PAD_X = SPACE_SM
export const ROW_PAD_Y = 6
export const ROW_GAP = 2
export const ROW_H = 45 // chat_row_height(false, false)
export const ROW_H_BRANCH = 47 + 14 // 61
export const ROW_H_PR = 47 + 16 // 63 — a PR badge is the tallest metadata row
export const ROW_H_COMPACT = 29

// Typography (typography.rs ui_rems — a 16px root)
export const TEXT_XS = 11 // space label, branch, corner status/time
export const TEXT_SM = 13 // row title, UI body
export const TEXT_MD = 14 // controls, chips, composer input (INPUT_TEXT_SIZE)
export const TEXT_BODY = 14 // transcript + composer body (MD_TEXT_SIZE)
export const TEXT_XL = 16 // content header title
export const TEXT_CODE = 12.5 // CODE_FONT_SIZE_DEFAULT
export const TEXT_TERMINAL = 13 // TERMINAL_FONT_SIZE_DEFAULT

// Markdown (markdown/render.rs)
export const MD_BLOCK_GAP = 12
export const MD_TEXT_SIZE = 14
export const MD_LINE_HEIGHT = 22
export const MD_CODE_TEXT_SIZE = 12.5
export const MD_CODE_LINE_HEIGHT = 18
export const MD_CODE_PADDING_X = 12
export const MD_CODE_PADDING_Y = 10
export const MD_TABLE_CELL_PADDING = 12
export const MD_TABLE_MIN_COLUMN_WIDTH = 96
export const MD_TABLE_MIN_COLUMN_CONTENT = 48
export const MD_INLINE_CODE_RADIUS = 4.5
export const MD_INLINE_CODE_PAD_X = 2
export const MD_INLINE_CODE_INSET_Y = 2
/** heading_metrics(): h1 19/27, h2 16/24, h3 15/22, h4+ 14/22. */
export const MD_HEADING_SIZES = [19, 16, 15, 14]
export const MD_HEADING_LINE_HEIGHTS = [27, 24, 22, 22]

// Transcript (transcript.rs)
export const USER_LINE_HEIGHT = 22 // the user bubble's line box
export const USER_COLLAPSED_LINES = 5
export const USER_COLLAPSE_CHARS = 400 // first-frame soft-wrap proxy
export const USER_TOGGLE_GAP = 8
export const ATT_THUMB_W = 112
export const ATT_THUMB_H = 80

// Composer (composer.rs)
export const COMPOSER_MAX_WIDTH = 768 // max-w-3xl
export const TEXTAREA_MIN = 76 // the empty-textarea floor
export const TEXTAREA_MAX = 260
export const ACTIONS_ROW_HEIGHT = 46
export const PILL_BORDER_V = 2
export const COMPOSER_HERO_HEIGHT = TEXTAREA_MIN + ACTIONS_ROW_HEIGHT + PILL_BORDER_V // 124
export const COMPOSER_HERO_RADIUS = 26 // COMPOSER_RADIUS
export const COMPACT_TOTAL_HEIGHT = 49 // compact pill, border-box
export const COMPOSER_DOCK_HEIGHT = 49 // = COMPACT_TOTAL_HEIGHT
export const COMPOSER_DOCK_RADIUS = COMPOSER_HERO_RADIUS - 4 // 22 — `surface_radius`
export const INPUT_TEXT_SIZE = 14
export const INPUT_LINE_HEIGHT = 22.75 // text-[14px] leading-relaxed
export const NEW_THREAD_SELECTOR_ROW_HEIGHT = 20
export const SESSION_FOOTER_HEIGHT = 24

// New-thread canvas (shell.rs)
export const NEW_THREAD_BACKGROUND_FROSTED_OPACITY = 0.84
export const NEW_THREAD_BACKGROUND_VIEWPORT_RATIO = 0.72
export const NEW_THREAD_BACKGROUND_MAX_HEIGHT = 760

// Motion (motion.rs): row hover washes blend over 150ms
export const TRANSITION = { duration: 0.15, ease: 'easeOut' as const }
export const POPOVER_TRANSITION = { duration: 0.12, ease: 'easeOut' as const }
// motion.rs NEW_THREAD_TRANSITION: 420ms ease-out-quint (the hero→dock glide)
export const NEW_THREAD_TRANSITION: { duration: number; ease: [number, number, number, number] } = {
  duration: 0.42,
  ease: [0.22, 1.0, 0.36, 1.0],
}

// Fonts: Zeron asks for Geist and falls back to the system sans/mono when the
// family is missing (theme.rs system_sans()/system_mono(): Segoe UI + Consolas
// on Windows, Helvetica + Menlo on macOS). Bundle geist-latin.woff2 to pin metrics.
export const FONT_SANS = 'Geist'
export const FONT_MONO = 'Geist Mono'
