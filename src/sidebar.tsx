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
  POPOVER_TRANSITION,
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
import { Icon, ZeronGlyph, type IconName } from './icons'
import { Menu } from './menu'
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
/** Accordion body: the rows clip inside a container whose height tweens open
 *  and closed (GPUIX motion — height is numeric, so the fold glides). */
function AccordionBody({
  open,
  rows,
  children,
}: {
  open: boolean
  rows: number
  children: React.ReactNode
}) {
  const height = rows * (ROW_H_PR + SIDEBAR_LIST_GAP)
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      transition={TRANSITION}
      style={{ overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: SIDEBAR_LIST_GAP }}
    >
      {children}
    </motion.div>
  )
}

export function Sidebar({
  pinned,
  sessions,
  selectedId,
  onSelect,
  onOpenSettings,
}: {
  pinned: Session[]
  sessions: Session[]
  selectedId: string
  onSelect: (id: string) => void
  onOpenSettings?: () => void
}) {
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [sessionsOpen, setSessionsOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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
          }}
        >
          <Menu
            value="all"
            onSelect={() => {}}
            side="bottom"
            sideOffset={6}
            width={SIDEBAR_WIDTH - 16}
            testId="spaces-filter"
            trigger={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  flexGrow: 1,
                  minWidth: 0,
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
              </div>
            }
            options={[
              { value: 'all', label: 'All projects', icon: 'folder' },
              { value: 'fieldnotes', label: 'fieldnotes', icon: 'folder', hint: 'This device' },
              { value: 'api', label: 'API server', icon: 'folder', hint: 'Build server' },
              { value: 'new', label: 'New project…', icon: 'plus' },
            ]}
          />
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              hover: { backgroundColor: C.hover },
            }}
          >
            <Icon name="listFilter" size={12} color={C.textFaint} />
          </div>
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
          <AccordionBody open={pinnedOpen} rows={pinned.length}>
            {pinned.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                selected={session.id === selectedId}
                onSelect={() => onSelect(session.id)}
              />
            ))}
          </AccordionBody>

          <div style={{ height: 6 }} />

          <AccordionHeader label="Sessions" onToggle={() => setSessionsOpen((v) => !v)} />
          <AccordionBody open={sessionsOpen} rows={sessions.length}>
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                selected={session.id === selectedId}
                onSelect={() => onSelect(session.id)}
              />
            ))}
          </AccordionBody>
        </div>
      </div>

      {/* Footer: the profile row ("L · Local only") opens the account menu —
          "Stored on this device" / Enable sync / Settings (command-palette/
          settings-menu.png). */}
      <div style={{ padding: 8, position: 'relative' }}>
        {menuOpen && (
          <>
            {/* Click-away backdrop */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: -2000, left: -100, right: 0, bottom: 0 }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={POPOVER_TRANSITION}
              style={{
                position: 'absolute',
                left: 8,
                right: 8,
                bottom: 60,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: C.overlay,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <text style={{ fontSize: TEXT_XS, color: C.textFaint, paddingLeft: 12, paddingTop: 10, paddingBottom: 6 }}>
                Stored on this device
              </text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 4 }}>
                <ProfileMenuRow icon="globe" label="Enable sync" onClick={() => setMenuOpen(false)} />
                <ProfileMenuRow
                  icon="settings"
                  label="Settings"
                  onClick={() => {
                    setMenuOpen(false)
                    onOpenSettings?.()
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
        <div
          onClick={() => setMenuOpen((v) => !v)}
          testId="profile-menu"
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
            backgroundColor: menuOpen ? C.hover : C.wash0,
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
            <text style={{ fontSize: 13, fontWeight: 500, color: C.text }}>L</text>
          </div>
          <text style={{ fontSize: TEXT_MD, color: C.text }}>Local only</text>
          <div style={{ flexGrow: 1 }} />
          <Icon name="chevronDown" size={13} color={C.textFaint} />
        </div>
      </div>
    </div>
  )
}

function ProfileMenuRow({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      testId={`profile-menu-${label.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 32,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 7,
        cursor: 'pointer',
        hover: { backgroundColor: C.hover },
      }}
    >
      <Icon name={icon} size={14} color={C.textMuted} />
      <text style={{ fontSize: TEXT_MD, color: C.text }}>{label}</text>
    </div>
  )
}

