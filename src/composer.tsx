/**
 * The Zeron composer dock (Zeron crates/ui composer.rs + composer_dock):
 *   row 1  paperclip · "Do anything…" · ✳ model chip · High · 200K · send
 *   footer workspace chip ("Local checkout") left, context meter right
 * The model chip opens the HarnessModelPicker; the meter mirrors
 * context-usage/remote-measured.png (a ring plus a hover tooltip card).
 */

import { useState } from 'react'
import { motion } from '@gpuix/react'
import {
  C,
  COMPOSER_DOCK_RADIUS,
  COMPOSER_HERO_RADIUS,
  COMPACT_TOTAL_HEIGHT,
  INPUT_LINE_HEIGHT,
  INPUT_TEXT_SIZE,
  POPOVER_TRANSITION,
  TEXT_MD,
  TEXT_SM,
  TEXT_XS,
} from './theme'
import { Icon } from './icons'
import { Menu, PickerChip } from './menu'
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
  hero = false,
  mockData = true,
}: {
  harness: Harness
  model: Model
  level: ReasoningLevel | null
  onHarness: (harness: Harness) => void
  onModel: (model: Model) => void
  onLevel: (level: ReasoningLevel | null) => void
  workspace: string
  onSend: (text: string) => void
  /** New-thread (blank canvas) layout: a tall card. Established sessions dock compact. */
  hero?: boolean
  /** Appearance → Mock data: off zeroes the demo context meter and target fixtures. */
  mockData?: boolean
}) {
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)
  const [meterOpen, setMeterOpen] = useState(false)

  const used = mockData ? 64_000 : 0
  const capacity = model.context
  const remaining = capacity - used

  const send = () => {
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
  }

  // Send plate: full text color once there is a draft; empty drafts dim to
  // textFaint so the composer does not shout a white button before it can send.
  // The up-arrow uses the page background; hover keeps the 0.85 opacity glide.
  const sendButton = (size = 28) => (
    <div
      onClick={send}
      testId="send"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: draft.trim() ? C.text : C.textFaint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        hover: { opacity: 0.85 },
      }}
    >
      <Icon name="arrowUp" size={14} color={C.background} />
    </div>
  )

  // Hero (new-thread) card: placeholder row on top, controls row below. The
  // blank canvas is always expanded (composer.rs: new chats render expanded).
  // Geometry mirrors COMPOSER_MIN_HEIGHT = 124: a 76px textarea box (the empty
  // floor) + a 46px actions row + the 2px hairline.
  if (hero) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div
          testId="composer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            paddingTop: 16,
            paddingBottom: 10,
            paddingLeft: 18,
            paddingRight: 12,
            borderRadius: COMPOSER_HERO_RADIUS,
            backgroundColor: C.input,
            borderWidth: 1,
            borderColor: focused ? C.selection : C.border,
            boxShadow: { offsetX: 0, offsetY: 10, blurRadius: 28, spreadRadius: -18, color: '#00000066' },
          }}
        >
          <textarea
            value={draft}
            placeholder="Do anything…"
            minRows={1}
            maxRows={4}
            autoFocus
            testId="composer-input"
            onChange={(e) => setDraft(e.value ?? '')}
            onSubmit={send}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ width: '100%', minWidth: 0, height: 52, fontSize: INPUT_TEXT_SIZE, lineHeight: INPUT_LINE_HEIGHT, color: C.text }}
            theme={{ caret: C.accent }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 46,
              marginTop: 0,
            }}
          >
            <Icon name="paperclip" size={16} color={C.textMuted} />
            <ModelPicker
              harness={harness}
              model={model}
              level={level}
              onHarness={onHarness}
              onModel={onModel}
              onLevel={onLevel}
            />
            <TraitsChip model={model} level={level} />
            <div style={{ flexGrow: 1 }} />
            {sendButton()}
          </div>
        </div>
      </div>
    )
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
          height: COMPACT_TOTAL_HEIGHT,
          paddingLeft: 14,
          paddingRight: 6,
          borderRadius: COMPOSER_DOCK_RADIUS,
          backgroundColor: C.input,
          borderWidth: 1,
          borderColor: focused ? C.selection : C.border,
          boxShadow: { offsetX: 0, offsetY: 10, blurRadius: 28, spreadRadius: -18, color: '#00000066' },
        }}
      >
        <Icon name="paperclip" size={16} color={C.textMuted} />
        <textarea
          value={draft}
          placeholder="Do anything…"
          minRows={1}
          maxRows={1}
          testId="composer-input"
          onChange={(e) => setDraft(e.value ?? '')}
          onSubmit={send}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flexGrow: 1, minWidth: 0, fontSize: INPUT_TEXT_SIZE, lineHeight: INPUT_LINE_HEIGHT, color: C.text }}
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
        {sendButton()}
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

/**
 * The new-thread floating target selectors (composer.rs
 * `render_new_thread_target_selectors`): a device chip and a workspace/folder
 * chip right-aligned above the hero card. These dissolve away (their row height
 * scales with the new-thread chrome) as the composer docks into a session.
 */
export function HeroTargetSelectors({
  device,
  workspace,
  mockData = true,
}: {
  device: string
  workspace: string
  mockData?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        width: '100%',
      }}
    >
      <Menu
        value={device}
        onSelect={() => {}}
        side="bottom"
        width={224}
        testId="picker-device"
        trigger={<PickerChip icon="monitor" label={device} />}
        options={
          mockData
            ? [
                { value: device, label: device, icon: 'monitor', hint: 'online' },
                { value: 'build', label: 'Build server', icon: 'monitor', hint: 'offline' },
              ]
            : [{ value: device, label: device, icon: 'monitor', hint: 'online' }]
        }
      />
      <Menu
        value={workspace}
        onSelect={() => {}}
        side="bottom"
        width={280}
        testId="picker-project"
        trigger={<PickerChip icon="folder" label={workspace} />}
        options={
          mockData
            ? [
                { value: workspace, label: workspace, icon: 'folder' },
                { value: 'api', label: 'API server/main', icon: 'folder' },
                { value: 'new', label: 'New project…', icon: 'plus' },
              ]
            : [
                { value: workspace, label: workspace, icon: 'folder' },
                { value: 'new', label: 'New project…', icon: 'plus' },
              ]
        }
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
