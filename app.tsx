import { useState } from 'react'
import { motion, render } from '@gpuix/react'
import { C, SIDEBAR_WIDTH, STATUS_STRIP_HEIGHT, TRANSITION } from './src/theme'
import { Sidebar } from './src/sidebar'
import { Titlebar } from './src/titlebar'
import { Composer } from './src/composer'
import { Transcript } from './src/transcript'
import { ChangesPane } from './src/changes'
import { HARNESSES, type Harness, type Model, type ReasoningLevel } from './src/catalog'
import { PINNED, SESSIONS, TURNS, type Session, type Turn } from './src/data'

const CONTENT_MAX_WIDTH = 720

export function App() {
  const [selectedId, setSelectedId] = useState('s7')
  const [turns, setTurns] = useState<Turn[]>(TURNS)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [changesOpen, setChangesOpen] = useState(true)
  const [harness, setHarness] = useState<Harness>(HARNESSES[0])
  const [model, setModel] = useState<Model>(HARNESSES[0].models[0])
  const [level, setLevel] = useState<ReasoningLevel | null>('High')

  const selected: Session = [...PINNED, ...SESSIONS].find((s) => s.id === selectedId) ?? SESSIONS[0]
  const workspace = `${selected.project}/${selected.branch.split('/')[1] ?? 'main'}`

  const send = (text: string) =>
    setTurns((current) => [
      ...current,
      { role: 'user', text },
      { role: 'commands', text: 'Ran 3 commands · read 2 files' },
      {
        role: 'assistant',
        text: 'Working on it — this is a **GPUIX** recreation of the Zeron shell. The real engine would take over from here.',
        at: 'Sep 6, 5:22 PM',
      },
    ])

  return (
    <div
      testId="app"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        // Zeron's frost shell: sidebar and titlebar sit on it; the content card
        // is the darkest plane and provides the separation border.
        backgroundColor: C.shell,
      }}
    >
      <Titlebar
        session={selected}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onNewSession={() => setSelectedId('s7')}
        rightPaneOpen={changesOpen}
        onToggleRightPane={() => setChangesOpen((v) => !v)}
      />

      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, minHeight: 0 }}>
        {/* Sidebar collapse: animate the clipping container, keep the inner
            sidebar at its fixed width so text never reflows (GPUIX motion). */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
          transition={TRANSITION}
          style={{ height: '100%', flexShrink: 0, overflow: 'hidden' }}
        >
          <div style={{ width: SIDEBAR_WIDTH, height: '100%' }}>
            <Sidebar pinned={PINNED} sessions={SESSIONS} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </motion.div>

        <ContentCard
          turns={turns}
          harness={harness}
          model={model}
          level={level}
          workspace={workspace}
          onHarness={(next) => {
            setHarness(next)
            setModel(next.models[0] ?? model)
          }}
          onModel={setModel}
          onLevel={setLevel}
          onSend={send}
        />

        <ChangesPane open={changesOpen} onClose={() => setChangesOpen(false)} />
      </div>
    </div>
  )
}

function ContentCard({
  turns,
  harness,
  model,
  level,
  workspace,
  onHarness,
  onModel,
  onLevel,
  onSend,
}: {
  turns: Turn[]
  harness: Harness
  model: Model
  level: ReasoningLevel | null
  workspace: string
  onHarness: (harness: Harness) => void
  onModel: (model: Model) => void
  onLevel: (level: ReasoningLevel | null) => void
  onSend: (text: string) => void
}) {
  return (
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
      {/* Transcript — the only scroller on this pane (GPUIX: nested scrolling
          is not supported, so nothing inside a row may scroll). */}
      <div
        testId="transcript"
        style={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: CONTENT_MAX_WIDTH,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <Transcript turns={turns} />
        </div>
      </div>

      {/* Reserved status strip (zeron h-6 WorkingIndicator row) */}
      <div style={{ height: STATUS_STRIP_HEIGHT, flexShrink: 0 }} />

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 16,
        }}
      >
        <div style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          <Composer
            harness={harness}
            model={model}
            level={level}
            onHarness={onHarness}
            onModel={onModel}
            onLevel={onLevel}
            workspace={workspace}
            onSend={onSend}
          />
        </div>
      </div>
    </div>
  )
}

render(<App />, {
  title: 'Zeron',
  width: 1320,
  height: 860,
  // macOS keeps its native traffic lights over a transparent titlebar; Windows
  // keeps its native titlebar so the window stays movable and closable.
  titlebarTransparent: typeof process !== 'undefined' && process.platform === 'darwin',
  trafficLightX: 16,
  trafficLightY: 17,
  windowBackground: 'opaque',
  focus: typeof process === 'undefined' || process.env.GPUIX_BACKGROUND !== '1',
})
