/**
 * HarnessModelPicker (Zeron crates/ui/src/pickers.rs): a harness rail beside a
 * model list, the reasoning ladder under the selected row, and the context
 * window readout. Built on GPUIX's Select so positioning, keyboard nav, and
 * outside-click dismissal come from the platform layer.
 */

import { motion, Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from '@gpuix/react'
import { C, POPOVER_TRANSITION, TEXT_MD, TEXT_SM, TEXT_XS } from './theme'
import { Icon } from './icons'
import { HARNESSES, traitsSummary, type Harness, type Model, type ReasoningLevel } from './catalog'

function HarnessRail({ current, onPick }: { current: Harness; onPick: (harness: Harness) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 4,
        borderRightWidth: 1,
        borderColor: C.border,
        flexShrink: 0,
      }}
    >
      {HARNESSES.map((harness) => {
        const active = harness.id === current.id
        return (
          <div
            key={harness.id}
            onClick={() => onPick(harness)}
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              // The rail sits inside the popover card: card_selected_bg().
              backgroundColor: active ? C.selected : C.wash0,
              hover: { backgroundColor: C.selected },
            }}
          >
            <svg
              source={harness.mark}
              style={{ width: 13, height: 13, color: harness.tint ?? C.textMuted, flexShrink: 0 }}
            />
          </div>
        )
      })}
    </div>
  )
}

function LadderChip({
  level,
  selected,
  onPick,
}: {
  level: ReasoningLevel
  selected: boolean
  onPick: () => void
}) {
  return (
    <div
      onClick={onPick}
      style={{
        height: 22,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: selected ? C.active : C.wash0,
        hover: { backgroundColor: selected ? C.active : C.selected },
      }}
    >
      <text
        style={{
          fontSize: TEXT_XS,
          fontWeight: 500,
          color: selected ? C.accent : C.textMuted,
          whiteSpace: 'nowrap',
        }}
      >
        {level}
      </text>
    </div>
  )
}

const CAPTION_WIDTH = 62

function Caption({ text }: { text: string }) {
  return (
    <text style={{ fontSize: 10, fontWeight: 500, color: C.textFaint, width: CAPTION_WIDTH, whiteSpace: 'nowrap' }}>
      {text}
    </text>
  )
}

export function ModelPicker({
  harness,
  model,
  level,
  onHarness,
  onModel,
  onLevel,
}: {
  harness: Harness
  model: Model
  level: ReasoningLevel | null
  onHarness: (harness: Harness) => void
  onModel: (model: Model) => void
  onLevel: (level: ReasoningLevel | null) => void
}) {
  return (
    <Select
      value={model.id}
      onValueChange={(id) => {
        const next = harness.models.find((m) => m.id === id)
        if (next) onModel(next)
      }}
    >
      <SelectTrigger
        testId="model-picker"
        style={(state) => ({
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 28,
          paddingLeft: 7,
          paddingRight: 7,
          borderRadius: 8,
          cursor: 'pointer',
          flexShrink: 0,
          backgroundColor: state.open ? C.hover : C.wash0,
          hover: { backgroundColor: C.hover },
        })}
      >
        <svg
          source={harness.mark}
          style={{ width: 12, height: 12, color: harness.tint ?? C.textMuted, flexShrink: 0 }}
        />
        <text style={{ fontSize: TEXT_MD, color: C.text, whiteSpace: 'nowrap' }}>{model.label}</text>
      </SelectTrigger>

      <SelectContent side="top" sideOffset={8} testId="model-menu">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={POPOVER_TRANSITION}
          style={{
            width: 300,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: C.overlay,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            overflow: 'hidden',
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <HarnessRail
            current={harness}
            onPick={(next) => {
              onHarness(next)
              onLevel(null)
            }}
          />
          <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: 4 }}>
            <SelectLabel style={{ height: 22, paddingLeft: 8, display: 'flex', alignItems: 'center' }}>
              <text style={{ fontSize: 10, fontWeight: 500, color: C.textFaint, whiteSpace: 'nowrap' }}>
                {harness.name.toUpperCase()}
              </text>
            </SelectLabel>
            <ModelRows harness={harness} model={model} onModel={onModel} />
            <div style={{ height: 1, backgroundColor: C.border, marginTop: 4, marginBottom: 6 }} />
            <Ladder model={model} level={level} onLevel={onLevel} />
            <ContextRow model={model} />
          </div>
        </motion.div>
      </SelectContent>
    </Select>
  )
}
function ModelRows({
  harness,
  model,
  onModel,
}: {
  harness: Harness
  model: Model
  onModel: (model: Model) => void
}) {
  if (harness.models.length === 0) {
    return (
      <div style={{ padding: 8 }}>
        <text style={{ fontSize: TEXT_SM, color: C.textFaint }}>No models reported</text>
      </div>
    )
  }
  return (
    <>
      {harness.models.map((row) => (
        <SelectItem key={row.id} value={row.id} asChild>
          <div
            onClick={() => onModel(row)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 34,
              paddingLeft: 8,
              paddingRight: 8,
              borderRadius: 8,
              cursor: 'pointer',
              hover: { backgroundColor: C.selected },
            }}
          >
            <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <text style={{ fontSize: TEXT_SM, color: C.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {row.label}
              </text>
              {row.description && (
                <text
                  style={{ fontSize: TEXT_XS, color: C.textFaint, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {row.description}
                </text>
              )}
            </div>
            {row.id === model.id && <Icon name="check" size={12} color={C.accent} />}
          </div>
        </SelectItem>
      ))}
    </>
  )
}




function Ladder({
  model,
  level,
  onLevel,
}: {
  model: Model
  level: ReasoningLevel | null
  onLevel: (level: ReasoningLevel | null) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 6,
      }}
    >
      <Caption text="Reasoning" />
      {model.reasoning.length === 0 ? (
        <text style={{ fontSize: TEXT_XS, color: C.textFaint }}>not offered</text>
      ) : (
        model.reasoning.map((entry) => (
          <LadderChip
            key={entry}
            level={entry}
            selected={level === entry}
            onPick={() => onLevel(level === entry ? null : entry)}
          />
        ))
      )}
    </div>
  )
}

function ContextRow({ model }: { model: Model }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 4,
      }}
    >
      <Caption text="Context" />
      <text style={{ fontSize: TEXT_XS, color: C.textMuted }}>
        {model.context.toLocaleString('en-US')} tokens
      </text>
    </div>
  )
}

/** The traits chip beside the model: "High · 200K" (pickers.rs traits_summary). */
export function TraitsChip({ model, level }: { model: Model; level: ReasoningLevel | null }) {
  const summary = traitsSummary(model, level)
  if (!summary) return null
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 28,
        paddingLeft: 4,
        paddingRight: 8,
        flexShrink: 0,
      }}
    >
      <text style={{ fontSize: TEXT_MD, color: C.textMuted, whiteSpace: 'nowrap' }}>{summary}</text>
    </div>
  )
}
