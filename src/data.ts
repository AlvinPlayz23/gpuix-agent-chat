/**
 * Fixture data matching zeron/docs/screenshots/sidebar-layout/detailed.png.
 * Sessions are attention-sorted into Pinned and Sessions accordions, exactly
 * like the reference screenshot.
 */

export type Harness = 'claude' | 'codex'

export interface Session {
  id: string
  project: string
  device: string
  title: string
  branch: string
  pr?: number
  time: string
  status: 'working' | 'done' | 'idle'
  harness: Harness
  /** Monogram letter + one of the 8 fixed project colors (sidebar README). */
  initial: string
  tint: string
}

export const PINNED: Session[] = [
  {
    id: 'p1',
    project: 'fieldnotes',
    device: 'This device',
    title: 'Polish the command palette',
    branch: 'fieldnotes/polish-the-command-palette',
    pr: 413,
    time: '17m',
    status: 'idle',
    harness: 'claude',
    initial: 'F',
    tint: '#5b8def',
  },
  {
    id: 'p2',
    project: 'API server',
    device: 'Build server',
    title: 'Fix authentication redirects',
    branch: 'fieldnotes/fix-authentication-redirects',
    pr: 414,
    time: '34m',
    status: 'idle',
    harness: 'claude',
    initial: 'A',
    tint: '#e2b55a',
  },
]

export const SESSIONS: Session[] = [
  {
    id: 's1',
    project: 'fieldnotes',
    device: 'This device',
    title: 'Review pull request comments',
    branch: 'fieldnotes/review-pull-request-comments',
    pr: 416,
    time: '',
    status: 'done',
    harness: 'claude',
    initial: 'F',
    tint: '#5b8def',
  },
  {
    id: 's2',
    project: 'API server',
    device: 'Build server',
    title: 'Add deployment status',
    branch: 'fieldnotes/add-deployment-status',
    time: '51m',
    status: 'idle',
    harness: 'claude',
    initial: 'A',
    tint: '#e2b55a',
  },
  {
    id: 's3',
    project: 'API server',
    device: 'Build server',
    title: 'Improve keyboard navigation',
    branch: 'fieldnotes/improve-keyboard-navigation',
    time: '1h',
    status: 'idle',
    harness: 'claude',
    initial: 'A',
    tint: '#e2b55a',
  },
  {
    id: 's4',
    project: 'fieldnotes',
    device: 'This device',
    title: 'Update project documentation',
    branch: 'fieldnotes/update-project-documentation',
    time: '1h',
    status: 'idle',
    harness: 'claude',
    initial: 'F',
    tint: '#5b8def',
  },
  {
    id: 's5',
    project: 'API server',
    device: 'Build server',
    title: 'Refine composer spacing',
    branch: 'fieldnotes/refine-composer-spacing',
    time: '1h',
    status: 'idle',
    harness: 'claude',
    initial: 'A',
    tint: '#e2b55a',
  },
  {
    id: 's6',
    project: 'fieldnotes',
    device: 'This device',
    title: 'Build settings search',
    branch: 'fieldnotes/build-settings-search',
    time: '2h',
    status: 'idle',
    harness: 'claude',
    initial: 'F',
    tint: '#5b8def',
  },
  {
    id: 's7',
    project: 'fieldnotes',
    device: 'This device',
    title: 'Build the Fieldnotes workspace',
    branch: 'fieldnotes/workspace',
    time: '1w',
    status: 'idle',
    harness: 'claude',
    initial: 'F',
    tint: '#5b8def',
  },
]

/** A transcript row. Mirrors the block-granularity rows of transcript.rs. */
export type Turn =
  | { role: 'user'; text: string; at?: string; attachments?: boolean }
  | { role: 'assistant'; text: string; at?: string }
  | { role: 'commands'; text: string }

export const TURNS: Turn[] = [
  {
    role: 'user',
    text: 'Review the workspace design',
    at: 'Sep 6, 5:20 PM',
  },
  { role: 'commands', text: 'Ran 8 commands · edited 1 file · read 5 files' },
  {
    role: 'assistant',
    text: `## Workspace scaffold

Set up the Fieldnotes workspace with the sidebar layout, session accordions, and the composer dock.

The shell is one row: a **sidebar** on the frost shell and a content card with its own border. Sessions are attention-sorted — pinned first, then everything else.

### Layout constants

| Token | Value |
| --- | --- |
| \`SIDEBAR_WIDTH\` | 280px |
| \`SIDEBAR_LIST_GAP\` | 2px |
| \`SIDEBAR_SESSION_SLOT\` | 63px |
| \`TITLEBAR_HEIGHT\` | 38px |

\`\`\`rust
fn sidebar_row_height(compact: bool, show_label: bool, branch: bool, pr: bool) -> f32 {
    // detailed row: label + title + metadata
    let mut h = 18.0 + 20.0; // lines 1-2
    if branch || pr { h += 18.0 } // line 3 is structural
    h
}
\`\`\`

- Sessions live in a collapsible accordion
- Hover swaps the corner for **Archive**
- The rail fades in below 48rem
`,
    at: 'Sep 6, 5:22 PM',
  },
  {
    role: 'user',
    text: 'Compare these layouts and suggest a clearer hierarchy.',
    attachments: true,
    at: 'Sep 6, 5:24 PM',
  },
  {
    role: 'assistant',
    text: "The three Appshots show a consistent visual style. I'll compare the spacing and reading order, then check how the layout adapts to smaller screens.",
    at: 'Sep 6, 5:24 PM',
  },
]

