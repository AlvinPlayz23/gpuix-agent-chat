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
import {
  C,
  FONT_SANS,
  HARNESS_ICON,
  ROW_RADIUS,
  SIDEBAR_LIST_GAP,
  SIDEBAR_LIST_PAD_TOP,
  SIDEBAR_WIDTH,
  SPACE_SM,
  TEXT_SM,
  TEXT_XS,
  TITLEBAR_HEIGHT,
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

function SessionRow({
  session,
  selected,
  onSelect,
}: {
  session: Session
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderRadius: ROW_RADIUS,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 5,
        paddingBottom: 5,
        cursor: 'pointer',
        backgroundColor: selected ? C.selected : C.wash0,
        hover: { backgroundColor: selected ? C.selected : C.hover },
      }}
    >
      {/* Line 1: space label + status corner */}
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
        <StatusCorner session={session} />
      </div>

      {/* Line 2: zeron glyph · project monogram · title */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SPACE_SM }}>
        <ZeronGlyph size={HARNESS_ICON} />
        <Monogram session={session} />
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <text
            style={{
              fontSize: TEXT_SM,
              lineHeight: 17,
              fontWeight: selected ? 500 : 400,
              color: selected ? C.text : C.textMuted,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {session.title}
          </text>
        </div>
      </div>

      {/* Line 3: branch + PR badge (structural — omitted when neither exists) */}
      {session.branch && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 1 }}>
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
      )}
    </div>
  )
}

function AccordionHeader({ label, onToggle }: { label: string; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
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
        paddingTop: TITLEBAR_HEIGHT,
      }}
    >
      {/* Spaces dropdown ("All projects") */}
      <div style={{ paddingLeft: 8, paddingRight: 8, paddingBottom: 4 }}>
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

      {/* Footer: profile ("Local only") */}
      <div style={{ padding: 8 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            height: 36,
            paddingLeft: 4,
            paddingRight: 8,
            borderRadius: 8,
            cursor: 'pointer',
            hover: { backgroundColor: C.hover },
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: C.raised,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <text style={{ fontSize: 11, fontWeight: 500, color: C.text }}>L</text>
          </div>
          <text style={{ fontSize: TEXT_SM, color: C.textMuted }}>Local only</text>
        </div>
      </div>
    </div>
  )
}

