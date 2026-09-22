import { useState } from 'react'
import { motion, render, useWindowSize } from '@gpuix/react'
import {
  C,
  COMPOSER_DOCK_HEIGHT,
  COMPOSER_HERO_HEIGHT,
  NEW_THREAD_TRANSITION,
  SIDEBAR_WIDTH,
  STATUS_STRIP_HEIGHT,
  TITLEBAR_HEIGHT,
  TRANSITION,
} from './src/theme'
import { Sidebar } from './src/sidebar'
import { Titlebar } from './src/titlebar'
import { Composer, HeroTargetSelectors } from './src/composer'
import { Transcript } from './src/transcript'
import { ChangesPane } from './src/changes'
import { SettingsNav, SettingsView } from './src/settings'
import { HARNESSES, type Harness, type Model, type ReasoningLevel } from './src/catalog'
import { PINNED, SESSIONS, TURNS, type Session, type Turn } from './src/data'

const CONTENT_MAX_WIDTH = 720
// The hero (new-thread) card floats a touch wider than the docked composer,
// matching the startup screenshot; it narrows as it docks.
const HERO_MAX_WIDTH = 760

export function App() {
  const [selectedId, setSelectedId] = useState('s7')
  const [turns, setTurns] = useState<Turn[]>(TURNS)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [changesOpen, setChangesOpen] = useState(true)
  const [harness, setHarness] = useState<Harness>(HARNESSES[0])
  const [model, setModel] = useState<Model>(HARNESSES[0].models[0])
  const [level, setLevel] = useState<ReasoningLevel | null>('High')
  // New-thread canvas: a session exists only after the first prompt is sent.
  // Boot on the hero (startup) screen; sending a prompt docks the composer.
  const [started, setStarted] = useState(false)
  // The settings view replaces the sessions sidebar + content card.
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsSection, setSettingsSection] = useState<'devices' | 'agents' | 'accounts' | 'appearance' | 'shortcuts' | 'archived'>('agents')
  // Appearance → Mock data: on keeps the screenshot fixtures; off clears every
  // fake session/title/transcript/diff and leaves only the empty shell.
  const [mockData, setMockData] = useState(true)

  const pinned = mockData ? PINNED : []
  const sessions = mockData ? SESSIONS : []
  const selected: Session | null = mockData
    ? ([...PINNED, ...SESSIONS].find((s) => s.id === selectedId) ?? SESSIONS[0])
    : null
  const workspace = selected ? `${selected.project}/${selected.branch.split('/')[1] ?? 'main'}` : 'No project'
  const device = selected?.device ?? 'This device'

  const send = (text: string) => {
    setStarted(true)
    setTurns((current) => {
      const user: Turn = { role: 'user', text }
      if (!mockData) return [...current, user]
      return [
        ...current,
        user,
        { role: 'commands', text: 'Ran 3 commands · read 2 files' },
        {
          role: 'assistant',
          text: 'Working on it — this is a **GPUIX** recreation of the Zeron shell. The real engine would take over from here.',
          at: 'Sep 6, 5:22 PM',
        },
      ]
    })
  }

  // The + button returns to the blank hero canvas.
  const newSession = () => {
    setTurns([])
    setStarted(false)
  }

  const setMockDataMode = (enabled: boolean) => {
    setMockData(enabled)
    // Switching modes must not leak the previous fixture transcript into the
    // empty shell (or leave the empty shell up when the fixtures return).
    setTurns(enabled ? TURNS : [])
    setStarted(enabled)
  }

  const selectSession = (id: string) => {
    if (!mockData) return
    setSelectedId(id)
    // Fixture sessions are established threads; restore the demo transcript.
    setTurns(TURNS)
    setStarted(true)
  }

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
        onNewSession={newSession}
        rightPaneOpen={changesOpen}
        onToggleRightPane={() => setChangesOpen((v) => !v)}
      />

      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, minHeight: 0 }}>
        {settingsOpen ? (
          <>
            <SettingsNav
              section={settingsSection}
              onSection={setSettingsSection}
              onBack={() => setSettingsOpen(false)}
            />
            <SettingsView section={settingsSection} mockData={mockData} onMockData={setMockDataMode} />
          </>
        ) : (
          <>
            {/* Sidebar collapse: animate the clipping container, keep the inner
                sidebar at its fixed width so text never reflows (GPUIX motion). */}
            <motion.div
              initial={false}
              animate={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
              transition={TRANSITION}
              style={{ height: '100%', flexShrink: 0, overflow: 'hidden' }}
            >
              <div style={{ width: SIDEBAR_WIDTH, height: '100%' }}>
                <Sidebar
                  pinned={pinned}
                  sessions={sessions}
                  selectedId={selected?.id ?? ''}
                  onSelect={selectSession}
                  onOpenSettings={() => setSettingsOpen(true)}
                  mockData={mockData}
                />
              </div>
            </motion.div>

            <ContentCard
              turns={turns}
              started={started}
              harness={harness}
              model={model}
              level={level}
              workspace={workspace}
              device={device}
              onHarness={(next) => {
                setHarness(next)
                setModel(next.models[0] ?? model)
              }}
              onModel={setModel}
              onLevel={setLevel}
              onSend={send}
              mockData={mockData}
            />

            <ChangesPane open={changesOpen} onClose={() => setChangesOpen(false)} mockData={mockData} />
          </>
        )}
      </div>
    </div>
  )
}

function ContentCard({
  turns,
  started,
  harness,
  model,
  level,
  workspace,
  device,
  onHarness,
  onModel,
  onLevel,
  onSend,
  mockData,
}: {
  turns: Turn[]
  started: boolean
  harness: Harness
  model: Model
  level: ReasoningLevel | null
  workspace: string
  device: string
  onHarness: (harness: Harness) => void
  onModel: (model: Model) => void
  onLevel: (level: ReasoningLevel | null) => void
  onSend: (text: string) => void
  mockData: boolean
}) {
  const { height: viewportHeight } = useWindowSize()
  const hero = !started
  // Heights of the composer block in each state (selectors row + composer).
  const heroHeight = 32 + COMPOSER_HERO_HEIGHT // selectors (24+8) + hero card
  const dockHeight = COMPOSER_DOCK_HEIGHT + 6 // pill + footer gap
  const contentHeight = viewportHeight - TITLEBAR_HEIGHT
  // Hero: the block floats a touch above the canvas middle. Dock: its
  // bottom rests 16px above the content card's bottom edge.
  const heroTop = Math.max((contentHeight - heroHeight) / 2 - 56, 24)
  const dockTop = Math.max(contentHeight - dockHeight - 16, 24)
  // Bottom slot reserved for the docked composer so the transcript clears it.
  const dockFootprint = dockHeight + 16

  return (
    <div
      style={{
        flexGrow: 1,
        minWidth: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: C.background,
        borderLeftWidth: 1,
        borderColor: C.border,
      }}
    >
      {/* Transcript — the only scroller on this pane. Empty until the first
          prompt; it fades in as the session docks. */}
      <motion.div
        initial={false}
        animate={{ opacity: hero ? 0 : 1 }}
        transition={NEW_THREAD_TRANSITION}
        style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
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
      </motion.div>

      {/* Composer: one persistent absolutely-positioned surface. Its `top`
          animates from the centered hero offset down to the docked offset, and
          its width morphs between the wide hero card and the narrower pill —
          the hero→dock glide (motion.rs NEW_THREAD_TRANSITION). GPUIX tweens
          numerics only, so position is driven by `top`, not flex. */}
      <motion.div
        initial={false}
        animate={{ top: hero ? heroTop : dockTop }}
        transition={NEW_THREAD_TRANSITION}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* New-thread floating target selectors: the row dissolves as the
              session docks (composer.rs new-thread chrome). */}
          <motion.div
            initial={false}
            animate={{ height: hero ? 24 : 0, opacity: hero ? 1 : 0 }}
            transition={NEW_THREAD_TRANSITION}
            style={{ width: '100%', maxWidth: HERO_MAX_WIDTH, flexShrink: 0, overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: 8 }}>
              <HeroTargetSelectors device={device} workspace={workspace} mockData={mockData} />
            </div>
          </motion.div>

          {/* One persistent composer surface; `hero` swaps its internal layout
              between the tall card and the compact pill, while its width
              morphs between the floating hero and the narrower dock. */}
          <motion.div
            initial={false}
            animate={{ width: hero ? HERO_MAX_WIDTH : CONTENT_MAX_WIDTH }}
            transition={NEW_THREAD_TRANSITION}
            style={{ flexShrink: 1, minWidth: 0, maxWidth: '100%' }}
          >
            <Composer
              harness={harness}
              model={model}
              level={level}
              onHarness={onHarness}
              onModel={onModel}
              onLevel={onLevel}
              workspace={workspace}
              onSend={onSend}
              hero={hero}
              mockData={mockData}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Dock footprint: reserves the bottom slot so the transcript stops above
          the composer once docked. Zero-height on the hero canvas. */}
      <motion.div
        initial={false}
        animate={{ height: hero ? 0 : dockFootprint }}
        transition={NEW_THREAD_TRANSITION}
        style={{ width: '100%', flexShrink: 0 }}
      />
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
