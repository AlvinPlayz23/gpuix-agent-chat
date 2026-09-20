/**
 * The Zeron composer dock (comet crates/ui composer_dock.rs): a floating
 * rounded input card with attach affordance, model chip, and send button.
 */

import { useState } from 'react'
import { C, TEXT_MD, TEXT_SM } from './theme'
import { Icon, ZeronGlyph } from './icons'

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [draft, setDraft] = useState('')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 48,
        paddingLeft: 14,
        paddingRight: 6,
        borderRadius: 24,
        backgroundColor: C.input,
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <Icon name="paperclip" size={15} color={C.textFaint} />
      <textarea
        value={draft}
        placeholder="Do anything…"
        minRows={1}
        maxRows={1}
        onChange={(e) => setDraft(e.value ?? '')}
        onSubmit={() => {
          if (draft.trim()) {
            onSend(draft.trim())
            setDraft('')
          }
        }}
        style={{
          flexGrow: 1,
          minWidth: 0,
          fontSize: TEXT_MD,
          lineHeight: 20,
          color: C.text,
        }}
        theme={{ caret: C.accent }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          height: 30,
          paddingLeft: 8,
          paddingRight: 8,
          borderRadius: 15,
          cursor: 'pointer',
          flexShrink: 0,
          hover: { backgroundColor: C.hover },
        }}
      >
        <ZeronGlyph size={12} />
        <text style={{ fontSize: TEXT_SM, fontWeight: 500, color: C.textMuted, whiteSpace: 'nowrap' }}>
          claude-sonnet-4-6
        </text>
      </div>
      <div
        onClick={() => {
          if (draft.trim()) {
            onSend(draft.trim())
            setDraft('')
          }
        }}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: C.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          hover: { backgroundColor: '#ffffff' },
        }}
      >
        <Icon name="arrowUp" size={16} color={C.background} />
      </div>
    </div>
  )
}
