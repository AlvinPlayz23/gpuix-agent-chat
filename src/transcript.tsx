/**
 * Transcript rows (Zeron crates/ui/src/transcript.rs): one row per block.
 *   user       one bubble, right-aligned, 22px line box, 5-line collapse cap
 *   assistant  markdown, then a timestamp + copy footer row
 *   commands   the collapsed tool summary row: chevron, "Ran N commands · …"
 *   attach     the Appshot strip: thumbnail cards, app identity, caption
 */

import { useState } from 'react'
import { motion } from '@gpuix/react'
import {
  BUBBLE_RADIUS,
  C,
  MD_BLOCK_GAP,
  MD_CODE_LINE_HEIGHT,
  MD_CODE_TEXT_SIZE,
  MD_HEADING_LINE_HEIGHTS,
  MD_HEADING_SIZES,
  MD_LINE_HEIGHT,
  MD_TEXT_SIZE,
  POPOVER_TRANSITION,
  TEXT_BODY,
  TEXT_SM,
  USER_LINE_HEIGHT,
} from './theme'
import { Icon } from './icons'
import type { Turn } from './data'

/** The markdown renderer's theme — Zeron's MD_* metrics + code tokens. */
const MD_THEME = {
  text: C.text,
  textMuted: C.textMuted,
  textFaint: C.textFaint,
  textDim: C.textDim,
  border: C.border,
  bg: C.background,
  accent: C.accent,
  caret: C.accent,
  codeText: C.codeText,
  codeWash: C.codeWash,
  metrics: {
    mdTextSize: MD_TEXT_SIZE,
    mdLineHeight: MD_LINE_HEIGHT,
    mdBlockGap: MD_BLOCK_GAP,
    mdHeadingSizes: MD_HEADING_SIZES,
    mdHeadingLineHeights: MD_HEADING_LINE_HEIGHTS,
    codeTextSize: MD_CODE_TEXT_SIZE,
    codeLineHeight: MD_CODE_LINE_HEIGHT,
  },
}

/** The timestamp + copy footer under an assistant turn. */
function AssistantFooter({ at }: { at: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, height: 20 }}>
      <text style={{ fontSize: TEXT_SM, color: C.textFaint }}>{at}</text>
      <div
        onClick={() => setCopied(true)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          hover: { backgroundColor: C.hover },
        }}
      >
        <Icon name={copied ? 'check' : 'copy'} size={13} color={copied ? C.success : C.textFaint} />
      </div>
    </div>
  )
}

/** The collapsed tool row: "Ran 8 commands · edited 1 file · read 5 files". */
function CommandRow({ summary }: { summary: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 22,
          paddingLeft: 2,
          paddingRight: 8,
          borderRadius: 6,
          cursor: 'pointer',
          alignSelf: 'flex-start',
          hover: { backgroundColor: C.hover },
        }}
      >
        <Icon name="chevronRight" size={12} color={C.textFaint} />
        <text style={{ fontSize: TEXT_SM, color: C.textFaint, whiteSpace: 'nowrap' }}>{summary}</text>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={POPOVER_TRANSITION}
          style={{
            marginLeft: 20,
            paddingLeft: 10,
            borderLeftWidth: 1,
            borderColor: C.border,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {summary.split(' · ').map((line) => (
            <text key={line} style={{ fontSize: TEXT_SM, color: C.textMuted }}>
              {line}
            </text>
          ))}
        </motion.div>
      )}
    </div>
  )
}

/** The Appshot strip: thumbnails with app identity rows and captions. */
function AttachmentCard({ app, caption, color }: { app: string; caption: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 150 }}>
      <div
        style={{
          width: 150,
          height: 108,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: C.border,
          backgroundColor: '#f4f2ee',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: 14,
            backgroundColor: '#e6e2db',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 6,
          }}
        >
          <text style={{ fontSize: 8, color: '#8a857d' }}>{`${app} — Product planning`}</text>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 6 }}>
          <text style={{ fontSize: 10, color: '#3d3a36' }}>Make room for good ideas.</text>
          <text style={{ fontSize: 7.5, color: '#8a857d' }}>A calmer workspace</text>
          <text style={{ fontSize: 7.5, color: '#8a857d' }}>Next steps</text>
          <text style={{ fontSize: 7.5, color: '#8a857d' }}>Progress</text>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <text style={{ fontSize: 9, fontWeight: 500, color: '#ffffff' }}>{app.slice(0, 1)}</text>
        </div>
        <text style={{ fontSize: TEXT_BODY, color: C.textMuted }}>{`${app} · Appshot`}</text>
      </div>
      <text style={{ fontSize: TEXT_BODY, color: C.text, textAlign: 'center' }}>{caption}</text>
    </div>
  )
}

const ATTACHMENTS: { app: string; caption: string; color: string }[] = [
  { app: 'Safari', caption: 'Fieldnotes · Product planning', color: '#3b82f6' },
  { app: 'Notes', caption: 'Design review · Notes', color: '#eab308' },
  { app: 'Finder', caption: 'Workspace ideas', color: '#60a5fa' },
]

function UserTurn({ turn }: { turn: Extract<Turn, { role: 'user' }> }) {
  const [expanded, setExpanded] = useState(false)
  const lines = turn.text.split('\n').length + Math.floor(turn.text.length / 96)
  const collapsible = lines > 5

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {turn.attachments && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'flex-end' }}>
          {ATTACHMENTS.map((attachment) => (
            <AttachmentCard key={attachment.caption} {...attachment} />
          ))}
        </div>
      )}
      <div
        style={{
          maxWidth: 620,
          backgroundColor: C.bubble,
          borderRadius: BUBBLE_RADIUS,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 10,
          paddingBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div
          style={{
            maxHeight: collapsible && !expanded ? USER_LINE_HEIGHT * 5 : undefined,
            overflow: 'hidden',
          }}
        >
          <text style={{ fontSize: TEXT_BODY, lineHeight: USER_LINE_HEIGHT, color: C.text }}>{turn.text}</text>
        </div>
        {collapsible && (
          <div
            onClick={() => setExpanded((v) => !v)}
            style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            <text style={{ fontSize: TEXT_SM, color: C.textFaint }}>{expanded ? 'Show less' : 'Show more'}</text>
          </div>
        )}
      </div>
    </div>
  )
}

/** One transcript block row. */
export function TurnRow({ turn }: { turn: Turn }) {
  if (turn.role === 'commands') return <CommandRow summary={turn.text} />
  if (turn.role === 'user') return <UserTurn turn={turn} />
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <markdown source={turn.text} theme={MD_THEME} />
      <AssistantFooter at={turn.at ?? 'Sep 6, 5:22 PM'} />
    </div>
  )
}

export function Transcript({ turns }: { turns: Turn[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
      {turns.map((turn, index) => (
        <TurnRow key={`${turn.role}-${index}`} turn={turn} />
      ))}
    </div>
  )
}
