/**
 * The Zeron sidebar (comet crates/ui shell.rs `render_chat_row` and friends),
 * recreated in GPUIX/React.
 *
 * Detailed row anatomy (SIDEBAR_SESSION_SLOT = 61px + 2px gap):
 *   line 1  "project @ device" 11px muted-50%  ·  corner: status word / time
 *   line 2  glyph · monogram · title 13px      ·  (17px line height)
 *   line 3  branch icon + branch 11px          ·  PR badge pushed right
 */

import { useState } from 'react'
import { motion } from '@gpuix/react'
import {
  C,
  FONT_SANS,
  HARNESS_ICON,
  ROW_H,
  ROW_H_BRANCH,
  ROW_H_PR,
  ROW_RADIUS,
  SIDEBAR_LIST_GAP,
  SIDEBAR_LIST_PAD_TOP,
  SIDEBAR_WIDTH,
  SPACE_SM,
  TEXT_MD,
  TEXT_SM,
  TEXT_XS,
  TRANSITION,
} from './theme'
import { Icon, ZeronGlyph } from './icons'
import type { Session } from './data'

function withAlpha(hex: string, alpha: number): string {
  return `${hex}${Math.round(alpha * 255).toString(16)}`
}

/** Project artwork fallback: initial on 8% tint, letter at 85% (sidebar README). */
function Monogram({ session }: { session: Session }) {
  return (
    <div
      style={{
        width: HARNESS_ICON,
        height: HARNESS_ICON,
        borderRadius: 3,
        backgroundColor: withAlpha(session.tint, 0.08),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <text style={{ fontSize: 9, fontFamily: 'Menlo', color: withAlpha(session.tint, 0.85) }}>
        {session.initial}
      </text>
    </div>
  )
}

function PullRequestBadge({ number }: { number: number }) {
  return (
    <div
      style={{
        backgroundColor: withAlpha(C.success, 0.12),
        borderRadius: 4,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 1,
        paddingBottom: 1,
        flexShrink: 0,
      }}
    >
      <text style={{ fontSize: 10, fontWeight: 500, color: C.success }}>{`#${number}`}</text>
    </div>
  )
}

/** Top-right corner: status word + glyph, or elapsed time for idle rows. */
function StatusCorner({ session }: { session: Session }) {
  if (session.status === 'done') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, height: 14, flexShrink: 0 }}>
        <Icon name="check" size={11} color={C.success} />
        <text style={{ fontSize: 10, fontWeight: 500, color: C.success }}>Done</text>
      </div>
    )
  }
  if (session.status === 'working') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, height: 14, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent }} />
        <text style={{ fontSize: 10, fontWeight: 500, color: C.accent }}>Working</text>
      </div>
    )
  }
  return (
    <div style={{ height: 14, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
      <text style={{ fontSize: 10, fontWeight: 500, color: C.subline }}>{session.time}</text>
    </div>
  )
}

/** Session row: hover fades in over 150ms, like zeron's session-row.tsx. */
function SessionRow({
  session,
  selected,
  onSelect,
}: {
  session: Session
  selected: boolean
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const height = session.branch ? (session.pr != null ? ROW_H_PR : ROW_H_BRANCH) : ROW_H
  const wash = selected || hovered

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setArchiving(false)
      }}
      testId={`session-row-${session.id}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1,
        height,
        borderRadius: ROW_RADIUS,
        paddingLeft: 8,
        paddingRight: 8,
        cursor: 'pointer',
      }}
    >
      {/* Hover/selected wash is its own layer so it can blend (motion), and so
          the archive swap never shifts content (shell.rs corner). */}
      <motion.div
        initial={false}
        animate={{ opacity: wash ? 1 : 0 }}
        transition={TRANSITION}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: ROW_RADIUS,
          backgroundColor: C.selected,
        }}
      />
      <RowLine1 session={session} archiving={archiving} onArchiveStart={() => setArchiving(true)} />
      <RowLine2 session={session} />
      {session.branch && <RowLine3 session={session} />}
    </div>
  )
}

function RowLine1({
  session,
  archiving,
  onArchiveStart,
}: {
  session: Session
  archiving: boolean
  onArchiveStart: () => void
}) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SPACE_SM }}>
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <text
          style={{
            fontSize: TEXT_XS,
            lineHeight: 14,
            color: C.subline,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {`${session.project} @ ${session.device}`}
        </text>
      </div>
      {/* Corner: status word / time; hovering the row swaps it for Archive. */}
      <div
        onMouseEnter={onArchiveStart}
        style={{ height: 14, flexShrink: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        {archiving ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={TRANSITION}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Icon name="trash" size={11} color={C.textMuted} />
            <text style={{ fontSize: 10, fontWeight: 500, color: C.textMuted }}>Archive</text>
          </motion.div>
        ) : (
          <StatusCorner session={session} />
        )}
      </div>
    </div>
  )
}

function RowLine2({ session }: { session: Session }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SPACE_SM }}>
      <ZeronGlyph size={HARNESS_ICON} />
      <Monogram session={session} />
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <text
          style={{
            fontSize: TEXT_SM,
            lineHeight: 17,
            color: C.text,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {session.title}
        </text>
      </div>
    </div>
  )
}

function RowLine3({ session }: { session: Session }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingLeft: 1,
      }}
    >
      <Icon name="gitBranch" size={11} color={C.subline} />
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <text
          style={{
            fontSize: TEXT_XS,
            lineHeight: 14,
            color: C.subline,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {session.branch}
        </text>
      </div>
      {session.pr != null && <PullRequestBadge number={session.pr} />}
    </div>
  )
}

function AccordionHeader({ label, onToggle }: { label: string; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      testId={`accordion-${label.toLowerCase()}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 28,
        paddingLeft: 8,
        paddingRight: 6,
        borderRadius: 6,
        cursor: 'pointer',
        hover: { backgroundColor: C.hover },
      }}
    >
      <text style={{ fontSize: TEXT_XS, fontWeight: 500, color: C.textFaint }}>{label}</text>
      <Icon name="chevronDown" size={11} color={C.textFaint} />
    </div>
  )
}
export function Sidebar({
  pinned,
  sessions,
  selectedId,
  onSelect,
}: {
  pinned: Session[]
  sessions: Session[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [sessionsOpen, setSessionsOpen] = useState(true)

  return (
    <div
      style={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Spaces dropdown ("All projects") */}
      <div
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderColor: '#ffffff0f',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            height: 30,
            paddingLeft: 8,
            paddingRight: 6,
            borderRadius: 8,
            cursor: 'pointer',
            hover: { backgroundColor: C.hover },
          }}
        >
          <Icon name="folder" size={13} color={C.textMuted} />
          <text style={{ fontSize: TEXT_SM, fontWeight: 500, color: C.text, fontFamily: FONT_SANS }}>
            All projects
          </text>
          <div style={{ flexGrow: 1 }} />
          <Icon name="chevronDown" size={11} color={C.textFaint} />
          <Icon name="listFilter" size={12} color={C.textFaint} />
        </div>
      </div>

      {/* Session list (single scroller; nothing inside it may scroll) */}
      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'scroll',
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: SIDEBAR_LIST_PAD_TOP,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: SIDEBAR_LIST_GAP }}>
          <AccordionHeader label="Pinned" onToggle={() => setPinnedOpen((v) => !v)} />
          {pinnedOpen &&
            pinned.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                selected={session.id === selectedId}
                onSelect={() => onSelect(session.id)}
              />
            ))}

          <div style={{ height: 6 }} />

          <AccordionHeader label="Sessions" onToggle={() => setSessionsOpen((v) => !v)} />
          {sessionsOpen &&
            sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                selected={session.id === selectedId}
                onSelect={() => onSelect(session.id)}
              />
            ))}
        </div>
      </div>

      {/* Footer: profile row — two lines, avatar on the left (appshots fixture). */}
      <div style={{ padding: 8 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            height: 44,
            paddingLeft: 6,
            paddingRight: 8,
            borderRadius: 8,
            cursor: 'pointer',
            hover: { backgroundColor: C.hover },
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: C.raised,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <text style={{ fontSize: 13, fontWeight: 500, color: C.text }}>D</text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <text style={{ fontSize: TEXT_MD, color: C.text }}>Development</text>
            <text style={{ fontSize: 12, color: C.textMuted }}>Local development runtime</text>
          </div>
          <div style={{ flexGrow: 1 }} />
          <Icon name="settings" size={14} color={C.textFaint} />
        </div>
      </div>
    </div>
  )
}

