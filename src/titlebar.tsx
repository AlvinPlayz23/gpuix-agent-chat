/**
 * Zeron's titlebar row (Zeron crates/ui/src/shell.rs): a 38px strip with 4px
 * top pad. The sidebar cluster (panel toggle, history arrows, new session)
 * sits over the sidebar's width; the session header (glyph, title, space) and
 * the right-pane toggle sit over the content card.
 *
 * `titlebarTransparent` is macOS-only (native traffic lights stay), so Windows
 * keeps its native titlebar and this row reads as the app toolbar.
 */

import { useWindowSize } from '@gpuix/react'
import { C, SIDEBAR_WIDTH, TEXT_SM, TITLEBAR_HEIGHT, TITLEBAR_TOP_PAD } from './theme'
import { Icon, ZeronGlyph } from './icons'
import type { Session } from './data'

/** 26px hit box + 5px gap = the 31px button pitch of the fixtures. */
export function ChromeButton({
  icon,
  onClick,
  size = 15,
  active,
  testId,
}: {
  icon: Parameters<typeof Icon>[0]['name']
  onClick?: () => void
  size?: number
  active?: boolean
  testId?: string
}) {
  return (
    <div
      onClick={onClick}
      testId={testId}
      style={{
        width: 26,
        height: 26,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        backgroundColor: active ? C.hover : C.wash0,
        hover: { backgroundColor: C.hover },
      }}
    >
      <Icon name={icon} size={size} color={active ? C.text : C.textMuted} />
    </div>
  )
}

export function Titlebar({
  session,
  sidebarOpen,
  onToggleSidebar,
  onNewSession,
  rightPaneOpen,
  onToggleRightPane,
}: {
  session: Session | null
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onNewSession: () => void
  rightPaneOpen: boolean
  onToggleRightPane: () => void
}) {
  const { width: windowWidth } = useWindowSize()
  // Anchor the session identity to the same centered content column as the
  // transcript/composer instead of letting it float at the titlebar's left edge.
  const contentLeft = sidebarOpen ? SIDEBAR_WIDTH : 0
  const contentRight = rightPaneOpen ? 420 : 0
  const contentWidth = Math.max(windowWidth - contentLeft - contentRight, 0)
  const contentPad = Math.max((contentWidth - 720) / 2, 0) + 24
  const collapsedButtonOffset = sidebarOpen ? 0 : 38
  const titlePaddingLeft = Math.max(contentPad - collapsedButtonOffset, 8)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: TITLEBAR_HEIGHT,
        flexShrink: 0,
        paddingTop: TITLEBAR_TOP_PAD,
        backgroundColor: C.background,
      }}
    >
      {!sidebarOpen && (
        <div
          style={{
            width: 38,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            backgroundColor: C.background,
          }}
        >
          <ChromeButton icon="panelLeft" active onClick={onToggleSidebar} testId="sidebar-toggle" />
        </div>
      )}

      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingLeft: titlePaddingLeft,
          paddingRight: 12,
          backgroundColor: C.background,
        }}
      >
        <ZeronGlyph size={14} />
        {session && (
          <>
            <text
              testId="session-title"
              style={{
                fontSize: TEXT_SM,
                fontWeight: 600,
                color: C.text,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: 420,
              }}
            >
              {session.title}
            </text>
            <text style={{ fontSize: TEXT_SM, color: C.textFaint, whiteSpace: 'nowrap' }}>
              {`${session.project} @ ${session.device}`}
            </text>
          </>
        )}
        <div style={{ flexGrow: 1 }} />
        {session?.branch && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              height: 24,
              paddingLeft: 7,
              paddingRight: 8,
              borderRadius: 12,
              backgroundColor: C.wash0,
              borderWidth: 1,
              borderColor: C.border,
              flexShrink: 0,
              hover: { backgroundColor: C.hover },
            }}
          >
            <Icon name="gitBranch" size={11} color={C.textFaint} />
            <text style={{ fontSize: 12, color: C.textMuted, whiteSpace: 'nowrap' }}>{session.branch}</text>
          </div>
        )}
        <ChromeButton icon="panelRight" active={rightPaneOpen} onClick={onToggleRightPane} testId="right-pane-toggle" />
      </div>
    </div>
  )
}
