/**
 * The Zeron composer dock (comet crates/ui composer.rs + composer_dock):
 *   row 1  paperclip · "Do anything…" · ✳ model chip · High · 200K · send
 *   footer workspace chip ("Local checkout") left, context meter right
 * The model chip opens the HarnessModelPicker; the meter mirrors
 * context-usage/remote-measured.png (a ring plus a hover tooltip card).
 */

import { useState } from 'react'
import { motion } from '@gpuix/react'
import { C, POPOVER_TRANSITION, TEXT_BODY, TEXT_SM, TEXT_XS } from './theme'
import { Icon } from './icons'
import { ModelPicker, TraitsChip } from './model-picker'
import type { Harness, Model, ReasoningLevel } from './catalog'

/** The context meter ring: the arc encodes used/capacity (32% in the fixture). */
function ContextRing({ ratio, color }: { ratio: number; color: string }) {
  const pct = Math.max(0, Math.min(1, ratio))
  const dash = 2 * Math.PI * 5.5
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
  <circle cx="7" cy="7" r="5.5" stroke="#000" stroke-opacity="0.16" stroke-width="2" fill="none"/>
  <circle cx="7" cy="7" r="5.5" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"
    stroke-dasharray="${(dash * pct).toFixed(2)} ${(dash * (1 - pct)).toFixed(2)}" transform="rotate(-90 7 7)"/>
</svg>`
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <svg source={svg} style={{ width: 14, height: 14, color, flexShrink: 0 }} />
      <text style={{ fontSize: TEXT_XS, color: C.textFaint }}>{`${Math.round(pct * 100)}%`}</text>
    </div>
  )
}

export function Composer({
  harness,
  model,
  level,
  onHarness,
  onModel,
  onLevel,
  workspace,
  onSend,
}: {
  harness: Harness
  model: Model
  level: ReasoningLevel | null
  onHarness: (harness: Harness) => void
  onModel: (model: Model) => void
  onLevel: (level: ReasoningLevel | null) => void
  workspace: string
  onSend: (text: string) => void
}) {
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)
  const [meterOpen, setMeterOpen] = useState(false)

  const used = 64_000
  const capacity = model.context
  const remaining = capacity - used

  const send = () => {
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div
        testId="composer"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: 48,
          paddingLeft: 14,
          paddingRight: 6,
          borderRadius: 24,
          backgroundColor: C.input,
          borderWidth: 1,
          borderColor: focused ? C.borderStrong : C.border,
        }}
      >
        <Icon name="paperclip" size={15} color={C.textFaint} />
        <textarea
          value={draft}
          placeholder="Do anything…"
          minRows={1}
          maxRows={1}
          onChange={(e) => setDraft(e.value ?? '')}
          onSubmit={send}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flexGrow: 1, minWidth: 0, fontSize: TEXT_BODY, lineHeight: 20, color: C.text }}
          theme={{ caret: C.accent }}
        />
        <ModelPicker
          harness={harness}
          model={model}
          level={level}
          onHarness={onHarness}
          onModel={onModel}
          onLevel={onLevel}
        />
        <TraitsChip model={model} level={level} />
        <div
          onClick={send}
          testId="send"
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: draft.trim() ? C.text : C.raised,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            hover: { backgroundColor: '#ffffff' },
          }}
        >
          <Icon name="arrowUp" size={16} color={draft.trim() ? C.background : C.textMuted} />
        </div>
      </div>

      <ComposerFooter
        workspace={workspace}
        used={used}
        capacity={capacity}
        remaining={remaining}
        meterOpen={meterOpen}
        onMeterEnter={() => setMeterOpen(true)}
        onMeterLeave={() => setMeterOpen(false)}
      />
    </div>
  )
}


function ComposerFooter({
  workspace,
  used,
  capacity,
  remaining,
  meterOpen,
  onMeterEnter,
  onMeterLeave,
}: {
  workspace: string
  used: number
  capacity: number
  remaining: number
  meterOpen: boolean
  onMeterEnter: () => void
  onMeterLeave: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        paddingLeft: 6,
        paddingRight: 6,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 20,
          paddingLeft: 6,
          paddingRight: 8,
          borderRadius: 6,
          cursor: 'pointer',
          hover: { backgroundColor: C.hover },
        }}
      >
        <Icon name="folder" size={12} color={C.textFaint} />
        <text style={{ fontSize: TEXT_SM, color: C.textFaint, whiteSpace: 'nowrap' }}>{workspace}</text>
      </div>
      <div style={{ flexGrow: 1 }} />
      <div
        onMouseEnter={onMeterEnter}
        onMouseLeave={onMeterLeave}
        style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <ContextRing ratio={used / capacity} color={C.textMuted} />
        {meterOpen && (
          <div style={{ position: 'absolute', bottom: 26, right: 0 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={POPOVER_TRANSITION}
              style={{
                width: 210,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: 10,
                backgroundColor: C.overlay,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
              }}
            >
              <text style={{ fontSize: TEXT_SM, fontWeight: 500, color: C.text }}>Context window</text>
              <text style={{ fontSize: TEXT_SM, color: C.textMuted }}>
                {`${used.toLocaleString('en-US')} / ${capacity.toLocaleString('en-US')} tokens`}
              </text>
              <text style={{ fontSize: TEXT_SM, color: C.textMuted }}>
                {`${remaining.toLocaleString('en-US')} tokens remaining`}
              </text>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
