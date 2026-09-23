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

import { DEFAULT_THEME_ID, THEMES, type ThemeSeed } from './themes'

export const DEFAULT_THEME = THEMES.find((theme) => theme.id === DEFAULT_THEME_ID) ?? THEMES[0]
/** Audit compatibility: the boot seed. Runtime theme switches mutate `C` below. */
export const SEED = DEFAULT_THEME

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
// ── Resolved tokens ─────────────────────────────────────────────────────────
// resolveTheme mirrors builtins.rs `variant()` + ui/theme.rs `from_variant()`:
// seeds stay exact, state washes/borders derive from appearance, and `applyTheme`
// mutates the exported objects so every render reads the active theme.
function resolveTheme(seed: ThemeSeed) {
  const dark = seed.appearance === 'dark'
  const ink = dark ? '#ffffff' : '#000000'
  const washBase = dark ? '#ebebeb' : '#3f3f46'
  const stateWash = (alpha: number) => withAlpha(washBase, alpha)
  const line = (alpha: number) => withAlpha(ink, alpha)
  const solid = dark ? '#ebebef' : '#232328'
  const syntax = seed.syntax

  return {
    // Surfaces
    background: seed.background,
    shell: seed.shell,
    raised: seed.raised,
    card: seed.card,
    dialog: mix(seed.card, seed.raised, dark ? 0.18 : 0.04),
    overlay: mix(seed.card, seed.raised, dark ? 0.34 : 0.02),
    terminalBg: seed.terminal,

    // State fills
    hover: line(dark ? 0.11 : 0.06),
    selected: stateWash(dark ? 0.11 : 0.06),
    active: withAlpha(seed.accent, dark ? 0.18 : 0.1),
    border: line(dark ? 0.1 : 0.12),
    borderStrong: line(dark ? 0.18 : 0.22),
    ring: line(dark ? 0.09 : 0.1),
    wash0: stateWash(0),
    band: line(dark ? 0.11 : 0.06),
    input: dark ? withAlpha(seed.raised, 0.72) : seed.card,
    scrim: dark ? '#00000099' : '#00000066',

    // Text
    text: seed.text,
    textMuted: seed.muted,
    textFaint: seed.faint,
    textDim: seed.muted,
    textBody: withAlpha(seed.text, 0.8),
    textArchived: withAlpha(seed.text, 0.55),
    subline: withAlpha(seed.muted, 0.5),
    harnessTint: withAlpha(seed.muted, 0.8),

    // Accent
    accent: seed.accent,
    accentStrong: seed.accent,
    accentWash: withAlpha(seed.accent, dark ? 0.22 : 0.12),
    onAccent: dark ? '#000000' : '#ffffff',
    selection: withAlpha(seed.accent, dark ? 0.35 : 0.24),
    caret: seed.accent,
    glyphLight: mix(seed.accent, dark ? '#ffffff' : seed.background, dark ? 0.28 : 0.18),
    glyphMid: seed.accent,
    glyphDeep: mix(seed.accent, '#000000', dark ? 0.18 : 0.26),
    codeText: seed.accent,
    codeWash: withAlpha(seed.accent, dark ? 0.22 : 0.12),

    // Status
    danger: seed.danger,
    dangerMuted: mix(seed.danger, seed.text, 0.28),
    dangerStrong: seed.danger,
    warning: seed.warning,
    warningMuted: mix(seed.warning, seed.text, 0.25),
    success: seed.success,
    successMuted: mix(seed.success, seed.text, 0.25),
    solid,
    onSolid: dark ? '#000000' : '#ffffff',
    cursor: withAlpha(seed.text, dark ? 0.4 : 0.55),
    diffAdd: seed.success,
    diffDel: seed.danger,
    diffHunk: withAlpha(seed.accent, dark ? 0.08 : 0.07),

    // Composer
    pill: dark ? withAlpha('#000000', 0.15) : seed.card,
    pillBorder: dark ? '#bdc7d117' : line(0.12),

    // Transcript
    bubble: stateWash(dark ? 0.08 : 0.04),

    // Syntax
    syntaxComment: syntax[0],
    syntaxKeyword: syntax[1],
    syntaxString: syntax[2],
    syntaxNumber: syntax[3],
    syntaxType: syntax[4],
    syntaxFunction: syntax[5],
    syntaxProperty: syntax[6],
    syntaxVariable: syntax[7],
    syntaxPunctuation: syntax[8],
    syntaxTag: syntax[9],
    syntaxAttribute: syntax[10],
    syntaxInvalid: syntax[11],
  }
}

export const C = resolveTheme(DEFAULT_THEME)
export const ANSI: string[] = [...DEFAULT_THEME.ansi]

export function themeById(id: string): ThemeSeed {
  return THEMES.find((theme) => theme.id === id) ?? DEFAULT_THEME
}

export function applyTheme(id: string): ThemeSeed {
  const seed = themeById(id)
  Object.assign(C, resolveTheme(seed))
  ANSI.splice(0, ANSI.length, ...seed.ansi)
  return seed
}
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
