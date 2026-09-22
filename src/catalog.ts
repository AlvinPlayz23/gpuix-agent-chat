/**
 * Harness + model catalog — the shape of zeron/crates/ui/src/pickers.rs
 * (`HarnessModelPicker`: harness rail + model list) and crates/harness
 * (`Model { label, description, reasoning_levels, options }`).
 *
 * Harness brand marks are monochrome SVGs tinted by the surface, exactly like
 * `pickers::harness_brand_icon` (only Claude carries a brand tint).
 */

import claudeMark from '../assets/icons/brands/claude-mark.svg' with { type: 'text' }
import openaiMark from '../assets/icons/brands/openai-mark.svg' with { type: 'text' }
import cursorMark from '../assets/icons/brands/cursor-mark.svg' with { type: 'text' }
import grokMark from '../assets/icons/brands/grok-mark.svg' with { type: 'text' }
import hermesMark from '../assets/icons/brands/hermes-mark.svg' with { type: 'text' }
import piMark from '../assets/icons/brands/pi-mark.svg' with { type: 'text' }
import opencodeMark from '../assets/icons/brands/opencode-mark.svg' with { type: 'text' }
import devinMark from '../assets/icons/brands/devin-mark.svg' with { type: 'text' }

export type ReasoningLevel = 'Minimal' | 'Low' | 'Medium' | 'High' | 'X-High'

export interface Model {
  id: string
  label: string
  description?: string
  reasoning: ReasoningLevel[]
  /** Context window in tokens — the composer's "· 200K" and the meter's cap. */
  context: number
}

export interface Harness {
  id: string
  name: string
  mark: string
  /** Brand tint; undefined paints the surface tint like every other harness. */
  tint?: string
  models: Model[]
}

/** pickers.rs: default_model = first row, default_reasoning = High when offered. */
/** icons.rs claude_brand() — the Claude mark's brand orange. */
export const CLAUDE_TINT = '#d97757'

export const HARNESSES: Harness[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    mark: claudeMark,
    tint: CLAUDE_TINT,
    models: [
      {
        id: 'fable-5-1',
        label: 'Fable 5.1',
        description: 'Flagship agentic coding model',
        reasoning: ['Low', 'Medium', 'High', 'X-High'],
        context: 200_000,
      },
      {
        id: 'fable-5',
        label: 'Fable 5',
        description: 'Balanced everyday agent',
        reasoning: ['Low', 'Medium', 'High'],
        context: 200_000,
      },
      {
        id: 'fable-5-mini',
        label: 'Fable 5 Mini',
        description: 'Cheap, fast tool runner',
        reasoning: [],
        context: 1_000_000,
      },
    ],
  },
  {
    id: 'codex',
    name: 'Codex',
    mark: openaiMark,
    models: [
      {
        id: 'gpt-5-codex',
        label: 'GPT-5 Codex',
        description: 'Long-horizon repo work',
        reasoning: ['Low', 'Medium', 'High'],
        context: 400_000,
      },
      {
        id: 'gpt-5',
        label: 'GPT-5',
        description: 'General purpose',
        reasoning: ['Minimal', 'Low', 'Medium'],
        context: 400_000,
      },
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    mark: cursorMark,
    models: [
      {
        id: 'cursor-agent',
        label: 'Agent',
        description: 'Balance',
        reasoning: ['Low', 'Medium', 'High'],
        context: 200_000,
      },
    ],
  },
  { id: 'grok', name: 'Grok', mark: grokMark, models: [] },
  { id: 'hermes', name: 'Hermes', mark: hermesMark, models: [] },
  { id: 'pi', name: 'Pi', mark: piMark, models: [] },
  { id: 'opencode', name: 'opencode', mark: opencodeMark, models: [] },
  { id: 'devin', name: 'Devin', mark: devinMark, models: [] },
]

export function harnessById(id: string): Harness {
  return HARNESSES.find((h) => h.id === id) ?? HARNESSES[0]
}

/** The traits trigger summary: "High · 200K" (pickers.rs `traits_summary`). */
export function traitsSummary(model: Model | undefined, level: ReasoningLevel | null): string {
  if (!model) return ''
  const parts: string[] = []
  if (level && model.reasoning.includes(level)) parts.push(level)
  if (model.context >= 1_000_000) parts.push(`${Math.round(model.context / 1_000_000)}M`)
  else if (model.context >= 1_000) parts.push(`${Math.round(model.context / 1_000)}K`)
  return parts.join(' · ')
}
