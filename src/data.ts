/**
 * Fixture data matching comet/docs/screenshots/sidebar-layout/detailed.png.
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

/** The transcript shown for the selected session (native <markdown>). */
export const TRANSCRIPT = `
## Workspace scaffold

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
`
