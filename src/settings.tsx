/**
 * The Settings view (comet crates/ui/src/settings.rs + appearance.rs, and
 * docs/media/harness-settings/s2-agents-settings.png).
 *
 * Layout: the sessions sidebar is replaced by a settings nav (Devices /
 * Agents / Accounts / Appearance / Shortcuts / Archived sessions, "Back" at
 * the foot). The content card carries the section header — title left, the
 * per-device switcher right — a description, then the section body.
 */

import { useState } from 'react'
import { motion } from '@gpuix/react'
import { C, POPOVER_TRANSITION, SIDEBAR_WIDTH, TEXT_BODY, TEXT_MD, TEXT_SM, TEXT_XS } from './theme'
import { Icon, ZeronGlyph, type IconName } from './icons'

type Section = 'devices' | 'agents' | 'accounts' | 'appearance' | 'shortcuts' | 'archived'

const SECTIONS: { id: Section; label: string; icon: IconName }[] = [
  { id: 'devices', label: 'Devices', icon: 'monitor' },
  { id: 'agents', label: 'Agents', icon: 'grid' },
  { id: 'accounts', label: 'Accounts', icon: 'key' },
  { id: 'appearance', label: 'Appearance', icon: 'settings' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'keyboard' },
  { id: 'archived', label: 'Archived sessions', icon: 'archive' },
]

/** The settings nav that stands in for the sessions sidebar. */
export function SettingsNav({
  section,
  onSection,
  onBack,
}: {
  section: Section
  onSection: (section: Section) => void
  onBack: () => void
}) {
  return (
    <div
      style={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 8,
      }}
    >
      <text style={{ fontSize: TEXT_XS, color: C.textFaint, paddingLeft: 20, paddingBottom: 8 }}>Settings</text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, paddingRight: 8 }}>
        {SECTIONS.map((item) => {
          const active = item.id === section
          return (
            <div
              key={item.id}
              onClick={() => onSection(item.id)}
              testId={`settings-nav-${item.id}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                height: 34,
                paddingLeft: 12,
                paddingRight: 12,
                borderRadius: 8,
                cursor: 'pointer',
                backgroundColor: active ? C.selected : C.wash0,
                hover: { backgroundColor: active ? C.selected : C.hover },
              }}
            >
              <Icon name={item.icon} size={14} color={active ? C.text : C.textMuted} />
              <text style={{ fontSize: TEXT_MD, fontWeight: active ? 500 : 400, color: active ? C.text : C.textMuted }}>
                {item.label}
              </text>
            </div>
          )
        })}
      </div>
      <div style={{ flexGrow: 1 }} />
      <div style={{ padding: 8 }}>
        <div
          onClick={onBack}
          testId="settings-back"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            height: 36,
            paddingLeft: 12,
            borderRadius: 8,
            cursor: 'pointer',
            hover: { backgroundColor: C.hover },
          }}
        >
          <Icon name="arrowLeft" size={14} color={C.textMuted} />
          <text style={{ fontSize: TEXT_MD, color: C.text }}>Back</text>
        </div>
      </div>
    </div>
  )
}

/** The toggle: a 36×20 pill with the knob gliding on `left` (GPUIX motion). */
function Toggle({ on, disabled, onToggle }: { on: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={() => {
        if (!disabled) onToggle()
      }}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        position: 'relative',
        flexShrink: 0,
        cursor: disabled ? undefined : 'pointer',
        backgroundColor: on ? '#e8e8ea' : C.raised,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <motion.div
        initial={false}
        animate={{ left: on ? 18 : 2 }}
        transition={POPOVER_TRANSITION}
        style={{
          position: 'absolute',
          top: 2,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: on ? C.background : C.textMuted,
        }}
      />
    </div>
  )
}
interface AgentRow {
  id: string
  name: string
  description: string
  installed: boolean
  enabled: boolean
  glyph?: boolean
}

const AGENTS: AgentRow[] = [
  { id: 'claude', name: 'Claude Code', description: "Anthropic's coding agent, driven through the Claude Code CLI.", installed: true, enabled: true, glyph: true },
  { id: 'codex', name: 'Codex', description: "OpenAI's coding agent, driven through the Codex CLI.", installed: true, enabled: true },
  { id: 'grok', name: 'Grok', description: "xAI's Grok Build agent (grok CLI).", installed: true, enabled: false },
  { id: 'hermes', name: 'Hermes', description: "Nous Research's Hermes Agent (hermes CLI).", installed: false, enabled: false },
  { id: 'pi', name: 'Pi', description: 'The pi coding agent (pi CLI).', installed: false, enabled: false },
]

function AgentRowView({ agent, index, onToggle }: { agent: AgentRow; index: number; onToggle: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 14,
        paddingBottom: 14,
        borderTopWidth: index === 0 ? 0 : 1,
        borderColor: C.border,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: C.card,
          borderWidth: 1,
          borderColor: C.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: agent.installed ? 1 : 0.5,
        }}
      >
        {agent.glyph ? (
          <ZeronGlyph size={18} />
        ) : (
          <Icon name="grid" size={16} color={agent.installed ? C.textMuted : C.textFaint} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, minWidth: 0 }}>
        <text style={{ fontSize: TEXT_BODY, fontWeight: 600, color: agent.installed ? C.text : C.textFaint }}>
          {agent.name}
        </text>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
          <text style={{ fontSize: TEXT_SM, color: agent.installed ? C.textMuted : C.textFaint }}>
            {agent.description}
          </text>
          {!agent.installed && (
            <text style={{ fontSize: TEXT_SM, color: C.warning }}>{`·  Install the ${agent.id} CLI to enable`}</text>
          )}
        </div>
      </div>
      <Toggle on={agent.enabled} disabled={!agent.installed} onToggle={onToggle} />
    </div>
  )
}

function AgentsSection() {
  const [agents, setAgents] = useState(AGENTS)
  return (
    <>
      <text style={{ fontSize: TEXT_SM, lineHeight: 20, color: C.textMuted }}>
        {
          "Choose which coding agents the composer offers. The setting is per device — switch devices in the header. Agents whose CLI isn't installed on a device can't be enabled there."
        }
      </text>
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'column',
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {agents.map((agent, index) => (
          <AgentRowView
            key={agent.id}
            agent={agent}
            index={index}
            onToggle={() =>
              setAgents((rows) => rows.map((row) => (row.id === agent.id ? { ...row, enabled: !row.enabled } : row)))
            }
          />
        ))}
      </div>
    </>
  )
}


function PlaceholderSection({ label }: { label: string }) {
  return (
    <text style={{ fontSize: TEXT_SM, lineHeight: 20, color: C.textMuted }}>
      {`${label} settings land here — this pane is a GPUIX placeholder.`}
    </text>
  )
}

/** The settings content card: section header + body. */
export function SettingsView({ section }: { section: Section }) {
  const active = SECTIONS.find((s) => s.id === section) ?? SECTIONS[1]
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
      <motion.div
        key={section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={POPOVER_TRANSITION}
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
            maxWidth: 860,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 32,
            paddingBottom: 48,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{active.label}</text>
            <div style={{ flexGrow: 1 }} />
            {/* Per-device switcher (the header chip in the reference). */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                height: 26,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 7,
                cursor: 'pointer',
                hover: { backgroundColor: C.hover },
              }}
            >
              <Icon name="monitor" size={13} color={C.textMuted} />
              <text style={{ fontSize: TEXT_SM, color: C.text }}>This device</text>
              <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.success }} />
            </div>
          </div>
          {section === 'agents' ? <AgentsSection /> : <PlaceholderSection label={active.label} />}
        </div>
      </motion.div>
    </div>
  )
}

