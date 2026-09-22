/**
 * Design-token audit — `bun run audit`.
 *
 * Recomputes every derived `zeron_dark` token with Zeron's own math and diffs
 * the result against `src/theme.ts`, then re-composites the recipes this port
 * actually paints and compares them with pixels measured off Zeron's own
 * reference images. Exits non-zero on any drift.
 *
 * Frozen surfaces it reads:
 *   ../zeron/crates/theme/src/builtins.rs  `zeron_dark()` seeds, `variant()`
 *   ../zeron/crates/theme/src/lib.rs       Color math, AccentRoles::derive
 *   ../zeron/crates/ui/src/theme.rs        wash/ink/hairline/band/scrim helpers,
 *                                          glass_hover/glass_selected_bg/
 *                                          card_selected_bg/user_bubble_bg
 *   ../zeron/crates/ui/src/composer.rs     COMPOSER_RADIUS, composer_sidebar_tint()
 *   ../zeron/crates/ui/src/shell.rs        row washes + text ramps
 *
 * Measured swatches (coordinates are the reference image's own):
 *   zeron/docs/screenshots/sidebar-layout/detailed.png   sidebar, selected row,
 *                                                       composer pill + hairline
 *   zeron/docs/screenshots/sidebar-layout/compact*.png   row hover pair
 *   zeron/docs/reference/original-comet.png              panel + sidebar planes
 */

import { C, SEED, blendOver, mix, withAlpha, wash, ink, hairline } from './src/theme'

// ── Zeron's Color::contrast / best_on_color / ensure_contrast ───────────────
const linear = (channel: number) => {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

const luminance = (hex: string) => {
  const value = hex.replace('#', '').slice(0, 6)
  const channel = (index: number) => linear(parseInt(value.slice(index * 2, index * 2 + 2), 16))
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const bestOnColor = (hex: string) =>
  contrast('#ffffff', hex) >= contrast('#000000', hex) ? '#ffffff' : '#000000'

/** `Color::ensure_contrast` — walk toward black/white in 5% steps. */
const ensureContrast = (hex: string, background: string, minimum: number) => {
  if (contrast(hex, background) >= minimum) return hex
  const target =
    contrast('#000000', background) >= contrast('#ffffff', background) ? '#000000' : '#ffffff'
  for (let step = 1; step <= 20; step += 1) {
    const candidate = mix(hex, target, step / 20)
    if (contrast(candidate, background) >= minimum) return candidate
  }
  return target
}

// ── Expected tokens ─────────────────────────────────────────────────────────
const primary = ensureContrast(SEED.accent, SEED.background, 3.0)
const strong =
  contrast(bestOnColor(primary), primary) < 4.5
    ? ensureContrast(primary, bestOnColor(primary), 4.5)
    : primary
const solid = '#ebebef'

const expected: [string, string, string][] = []
const token = (key: keyof typeof C, value: string, source: string) =>
  expected.push([String(key), value, source])

// surfaces
token('background', SEED.background, 'builtins zeron_dark background')
token('shell', SEED.shell, 'builtins zeron_dark shell')
token('raised', SEED.raised, 'builtins zeron_dark raised')
token('card', SEED.card, 'builtins zeron_dark card')
token('dialog', mix(SEED.card, SEED.raised, 0.18), 'variant(): card.mix(raised, 0.18)')
token('overlay', mix(SEED.card, SEED.raised, 0.34), 'variant(): card.mix(raised, 0.34)')
token('terminalBg', SEED.terminal, 'builtins terminal_background')

// state fills
token('hover', withAlpha('#ffffff', 0.11), 'variant(): border_tone(white).with_alpha(0.11)')
token('selected', wash(0.11), 'theme.rs glass_selected_bg() / card_selected_bg()')
token('active', withAlpha(primary, 0.18), 'variant(): accent.primary.with_alpha(0.18)')
token('border', hairline(0.1), 'variant(): border_tone(white).with_alpha(0.10)')
token('borderStrong', hairline(0.18), 'variant(): border_tone(white).with_alpha(0.18)')
token('ring', hairline(0.09), 'card_selected_shadows(): hairline(0.09) inset')
token('wash0', wash(0), 'shell.rs render_chat_row rest_bg')
token('band', withAlpha('#ffffff', 0.11), 'from_variant(): band = colors.hover')
token('input', withAlpha(SEED.raised, 0.72), 'variant(): raised.with_alpha(0.72)')
token('scrim', withAlpha('#000000', 0.6), 'theme.rs scrim(SCRIM_ALPHA_DARK)')

// text
token('text', SEED.text, 'builtins zeron_dark text')
token('textMuted', SEED.muted, 'builtins muted after ensure_contrast(background, 4.5)')
token('textFaint', SEED.faint, 'builtins zeron_dark faint')
token('textDim', SEED.muted, 'from_variant(): text_dim = text_muted')
token('textBody', withAlpha(SEED.text, 0.8), 'shell.rs render_chat_row rest_text')
token('textArchived', withAlpha(SEED.text, 0.55), 'shell.rs render_chat_row archived text')
token('subline', withAlpha(SEED.muted, 0.5), 'shell.rs subline = text_muted.opacity(0.5)')
token('harnessTint', withAlpha(SEED.muted, 0.8), 'shell.rs tint.unwrap_or(subline).opacity(0.8)')

// accent — AccentRoles::derive over the #060606 background
token('accent', primary, 'AccentRoles::derive(#8b7cf6, dark, #060606)')
token('accentStrong', strong, 'AccentRoles.strong')
token('accentWash', withAlpha(primary, 0.22), 'AccentRoles.wash = primary.with_alpha(0.22)')
token('onAccent', bestOnColor(primary), 'AccentRoles.on = best_on_color')
token('selection', withAlpha(primary, 0.35), 'AccentRoles.selection')
token('caret', primary, 'AccentRoles.caret')
token('glyphLight', mix(primary, '#ffffff', 0.28), 'AccentRoles.glyph[0]')
token('glyphMid', primary, 'AccentRoles.glyph[1]')
token('glyphDeep', mix(primary, '#000000', 0.18), 'AccentRoles.glyph[2]')
token('codeText', primary, 'from_variant(): code_text = accent.primary')
token('codeWash', withAlpha(primary, 0.22), 'from_variant(): code_wash = accent.wash')

// status
token('danger', SEED.danger, 'builtins zeron_dark danger')
token('dangerMuted', mix(SEED.danger, SEED.text, 0.28), 'variant(): danger.mix(text, 0.28)')
token('dangerStrong', SEED.danger, 'from_variant(): danger_strong = colors.danger')
token('warning', SEED.warning, 'builtins zeron_dark warning')
token('warningMuted', mix(SEED.warning, SEED.text, 0.25), 'variant(): warning.mix(text, 0.25)')
token('success', SEED.success, 'builtins zeron_dark success')
token('successMuted', mix(SEED.success, SEED.text, 0.25), 'variant(): success.mix(text, 0.25)')
token('solid', solid, 'variant(): rgb(235,235,239)')
token('onSolid', bestOnColor(solid), 'variant(): solid.best_on_color()')
token('cursor', withAlpha(SEED.text, 0.4), 'variant(): text.with_alpha(0.40)')
token('diffAdd', SEED.success, 'variant(): diff_add = success')
token('diffDel', SEED.danger, 'variant(): diff_delete = danger')
token('diffHunk', withAlpha(primary, 0.08), 'variant(): accent.primary.with_alpha(0.08)')

// composer
token('pill', withAlpha('#000000', 0.15), 'composer_sidebar_tint() resolves to black @ 15%')
token('pillBorder', '#bdc7d117', 'composer.rs pill_border hsla(210, 0.18, 0.78, 0.09)')
// transcript
token('bubble', wash(0.08), 'theme.rs user_bubble_bg()')

// ── Measured composites ─────────────────────────────────────────────────────
// [label, base, fill, expected pixel, tolerance, source]. The expected pixel is
// read out of Zeron's own reference images, so this half pins the *recipes* —
// not just the literals. The fixtures render glass over a light desktop, so the
// sidebar base measures #181818 there while the token family itself is
// base-independent: what must match is the composite delta.
const composites: [string, string, string, string, number, string][] = [
  ['sidebar rest', '#181818', wash(0), '#181818', 0, 'detailed.png (305,400)'],
  ['row selected', '#181818', C.selected, '#2f2f2f', 0, 'detailed.png (155,690)'],
  ['row hover', '#181818', C.hover, '#313131', 0, 'compact.png ↔ compact-hover.png diff'],
  ['composer pill', '#0d0d0d', C.pill, '#0b0b0b', 0, 'detailed.png (700,737)'],
  ['composer pill hairline', '#0b0b0b', C.pillBorder, '#1b1c1d', 0, 'detailed.png (700,711)'],
  ['harness mark (Claude)', '#181818', withAlpha('#d97757', 0.8), '#b3644b', 1, 'compact-hover.png diff'],
  ['original app panel', '#060606', wash(0), '#060606', 0, 'docs/reference/original-comet.png'],
  ['original app sidebar', '#0d0d0d', wash(0), '#0d0d0d', 0, 'docs/reference/original-comet.png'],
]

// ── Report ──────────────────────────────────────────────────────────────────
const channelDiff = (a: string, b: string) => {
  const parse = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.replace('#', '').slice(i - 1, i + 1), 16))
  return Math.max(...parse(a).map((value, index) => Math.abs(value - parse(b)[index])))
}

let failures = 0
const width = Math.max(...expected.map(([key]) => key.length))

console.log('tokens')
for (const [key, value, source] of expected) {
  const actual = C[key as keyof typeof C]
  const ok = actual === value
  if (!ok) failures += 1
  console.log(
    `  ${ok ? 'ok  ' : 'FAIL'} ${key.padEnd(width)} ${actual}${ok ? '' : ` != ${value}`}  ${source}`,
  )
}

console.log('\ncomposited swatches (recomputed vs measured)')
for (const [label, base, fill, pixel, tolerance, source] of composites) {
  const computed = blendOver(fill, base)
  const delta = channelDiff(computed, pixel)
  const ok = delta <= tolerance
  if (!ok) failures += 1
  console.log(
    `  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(22)} ${computed} vs ${pixel} (delta ${delta})  ${source}`,
  )
}

console.log(
  `\nhelpers: wash(0.11)=${wash(0.11)} ink(0.06)=${ink(0.06)} hairline(0.09)=${hairline(0.09)}`,
)
console.log(failures === 0 ? '\nall tokens match Zeron' : `\n${failures} mismatch(es)`)
if (failures > 0) process.exit(1)
