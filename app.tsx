/**
 * Zeron recreated in GPUIX/React — sidebar + transcript + composer shell.
 *
 * Reference: comet/docs/screenshots/sidebar-layout/detailed.png
 * Theme: Zeron Dark (comet/crates/theme builtins.rs)
 *
 * Run: bun run dev   (bun --hot remounts on save)
 */

import { useState } from 'react'
import { render } from '@gpuix/react'
import {
  C,
  FONT_SANS,
  SIDEBAR_WIDTH,
  STATUS_STRIP_HEIGHT,
  TEXT_MD,
  TEXT_SM,
  TITLEBAR_HEIGHT,
  TITLEBAR_TOP_PAD,
} from './src/theme'
import { Icon, ZeronGlyph } from './src/icons'
import { Sidebar } from './src/sidebar'
import { Composer } from './src/composer'
import { PINNED, SESSIONS, TRANSCRIPT } from './src/data'

/** Markdown renderer theme — Zeron Dark tokens (chat.tsx CHAT_THEME shape). */
const MD_THEME = {
  text: C.text,
  textMuted: C.textMuted,
  textFaint: C.textFaint,
  textDim: C.textMuted,
  border: C.border,
  bg: C.background,
  accent: C.accent,
  caret: C.accent,
  fontSans: FONT_SANS,
  codeText: '#e8e8ea',
  codeWash: '#ebebef14',
  metrics: {
    mdTextSize: 14,
    mdLineHeight: 22,
    mdBlockGap: 14,
    mdHeadingSizes: [20, 16, 14, 14],
    mdHeadingLineHeights: [28, 24, 22, 22],
    codeTextSize: 12.5,
    codeLineHeight: 20,
    diffLineHeight: 20,
    diffFileHeaderHeight: 34,
  },
}

const CONTENT_MAX_WIDTH = 720

interface Turn {
  role: 'user' | 'assistant'
  text: string
}

function ChromeButton({ icon, onClick }: { icon: Parameters<typeof Icon>[0]['name']; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
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
      <Icon name={icon} size={15} color={C.textMuted} />
    </div>
  )
}

function UserTurn({ text }: { text: string }) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 12,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <text style={{ fontSize: TEXT_MD, lineHeight: 22, color: C.text, width: '100%' }}>{text}</text>
    </div>
  )
}

export function App() {
  const [selectedId, setSelectedId] = useState('s7')
  const [turns, setTurns] = useState<Turn[]>([
    { role: 'user', text: 'Build the Fieldnotes workspace — sidebar, session accordions, and the composer dock.' },
    { role: 'assistant', text: TRANSCRIPT },
  ])
  const selected = [...PINNED, ...SESSIONS].find((s) => s.id === selectedId) ?? SESSIONS[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Titlebar strip: sidebar chrome left, session header right */}
      <div style={{ display: 'flex', flexDirection: 'row', height: TITLEBAR_HEIGHT, flexShrink: 0, paddingTop: TITLEBAR_TOP_PAD }}>
        <div
          style={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          <ChromeButton icon="panelLeft" />
          <ChromeButton icon="arrowLeft" />
          <ChromeButton icon="arrowRight" />
          <div style={{ flexGrow: 1 }} />
          <ChromeButton icon="plus" />
        </div>
        <div
          style={{
            flexGrow: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 16,
            paddingRight: 16,
            borderLeftWidth: 1,
            borderColor: C.border,
          }}
        >
          <ZeronGlyph size={14} />
          <text style={{ fontSize: TEXT_SM, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {selected.title}
          </text>
          <text style={{ fontSize: TEXT_SM, color: C.textFaint, whiteSpace: 'nowrap' }}>
            {`${selected.project} @ ${selected.device}`}
          </text>
          <div style={{ flexGrow: 1 }} />
          <ChromeButton icon="panelRight" />
        </div>
      </div>

      {/* Body: sidebar on the shell, content card with its own border */}
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, minHeight: 0 }}>
        <Sidebar pinned={PINNED} sessions={SESSIONS} selectedId={selectedId} onSelect={setSelectedId} />

        <div
          style={{
            flexGrow: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: C.background,
            borderLeftWidth: 1,
            borderColor: C.border,
          }}
        >
          {/* Transcript — the only scroller on this pane */}
          <div style={{ flexGrow: 1, minHeight: 0, overflowY: 'scroll', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: CONTENT_MAX_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                paddingLeft: 24,
                paddingRight: 24,
                paddingTop: 24,
                paddingBottom: 24,
              }}
            >
              {turns.map((turn, i) =>
                turn.role === 'user' ? (
                  <UserTurn key={i} text={turn.text} />
                ) : (
                  <markdown key={i} source={turn.text} theme={MD_THEME} />
                ),
              )}
            </div>
          </div>

          {/* Reserved status strip (zeron h-6 WorkingIndicator row) */}
          <div style={{ height: STATUS_STRIP_HEIGHT, flexShrink: 0 }} />

          {/* Composer dock */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingLeft: 24, paddingRight: 24, paddingBottom: 20 }}>
            <div style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
              <Composer
                onSend={(text) =>
                  setTurns((t) => [
                    ...t,
                    { role: 'user', text },
                    {
                      role: 'assistant',
                      text: 'Working on it — this is a **GPUIX** recreation of the Zeron shell. The real engine would take over from here.',
                    },
                  ])
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

render(<App />, {
  title: 'Zeron',
  width: 1302,
  height: 1000,
  titlebarTransparent: true,
  windowBackground: 'blurred',
  focus: typeof process === 'undefined' || process.env.GPUIX_BACKGROUND !== '1',
})
