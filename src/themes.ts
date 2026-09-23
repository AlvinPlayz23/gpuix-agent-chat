/**
 * Theme registry — seeds ported from zeron/crates/theme/src/builtins.rs.
 * `syntax` order matches theme.ts: comment, keyword, string, number, type,
 * function, property, variable, punctuation, tag, attribute, invalid.
 */

export type ThemeAppearance = 'dark' | 'light'

export interface ThemeSeed {
  id: string
  name: string
  appearance: ThemeAppearance
  background: string
  shell: string
  raised: string
  card: string
  text: string
  muted: string
  faint: string
  accent: string
  danger: string
  warning: string
  success: string
  terminal: string
  ansi: string[]
  syntax: string[]
}

export const DEFAULT_THEME_ID = 'vscode-dark-plus'

export const THEMES: ThemeSeed[] = [
  {
    id: 'zeron-dark', name: 'Zeron Dark', appearance: 'dark',
    background: '#060606', shell: '#0d0d0d', raised: '#343438', card: '#0e0e0e',
    text: '#e8e8ea', muted: '#a9a9ae', faint: '#85858a', accent: '#8b7cf6',
    danger: '#f87171', warning: '#facc15', success: '#34d399', terminal: '#090909',
    ansi: ['#242424', '#f87171', '#4ade80', '#facc15', '#60a5fa', '#c084fc', '#22d3ee', '#d4d4d8', '#52525b', '#fca5a5', '#86efac', '#fde047', '#93c5fd', '#d8b4fe', '#67e8f9', '#fafafa'],
    syntax: ['#92929a', '#8b7cf6', '#34d399', '#facc15', '#c084fc', '#60a5fa', '#f472b6', '#e8e8ea', '#a1a1aa', '#f472b6', '#22d3ee', '#f87171'],
  },
  {
    id: 'vscode-dark-plus', name: 'Dark+', appearance: 'dark',
    background: '#1e1e1e', shell: '#181818', raised: '#2a2d2e', card: '#252526',
    text: '#d4d4d4', muted: '#a8a8a8', faint: '#858585', accent: '#007acc',
    danger: '#f48771', warning: '#cca700', success: '#89d185', terminal: '#1e1e1e',
    ansi: ['#000000', '#cd3131', '#0dbc79', '#e5e510', '#2472c8', '#bc3fbc', '#11a8cd', '#e5e5e5', '#666666', '#f14c4c', '#23d18b', '#f5f543', '#3b8eea', '#d670d6', '#29b8db', '#e5e5e5'],
    syntax: ['#6a9955', '#c586c0', '#ce9178', '#b5cea8', '#4ec9b0', '#dcdcaa', '#9cdcfe', '#d4d4d4', '#d4d4d4', '#569cd6', '#9cdcfe', '#f44747'],
  },
  {
    id: 'catppuccin-mocha', name: 'Catppuccin Mocha', appearance: 'dark',
    background: '#1e1e2e', shell: '#181825', raised: '#313244', card: '#242436',
    text: '#cdd6f4', muted: '#a6adc8', faint: '#9399b2', accent: '#cba6f7',
    danger: '#f38ba8', warning: '#f9e2af', success: '#a6e3a1', terminal: '#1e1e2e',
    ansi: ['#45475a', '#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#f5c2e7', '#94e2d5', '#bac2de', '#585b70', '#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#f5c2e7', '#94e2d5', '#a6adc8'],
    syntax: ['#6c7086', '#cba6f7', '#a6e3a1', '#fab387', '#f9e2af', '#89b4fa', '#94e2d5', '#cdd6f4', '#bac2de', '#f38ba8', '#f5c2e7', '#f38ba8'],
  },
  {
    id: 'tokyo-night', name: 'Tokyo Night', appearance: 'dark',
    background: '#1a1b26', shell: '#16161e', raised: '#292e42', card: '#1f2335',
    text: '#c0caf5', muted: '#9aa5ce', faint: '#7f87ad', accent: '#7aa2f7',
    danger: '#f7768e', warning: '#e0af68', success: '#9ece6a', terminal: '#1a1b26',
    ansi: ['#15161e', '#f7768e', '#9ece6a', '#e0af68', '#7aa2f7', '#bb9af7', '#7dcfff', '#a9b1d6', '#414868', '#f7768e', '#9ece6a', '#e0af68', '#7aa2f7', '#bb9af7', '#7dcfff', '#c0caf5'],
    syntax: ['#565f89', '#bb9af7', '#9ece6a', '#ff9e64', '#2ac3de', '#7aa2f7', '#73daca', '#c0caf5', '#9abdf5', '#f7768e', '#e0af68', '#f7768e'],
  },
  {
    id: 'github-dark', name: 'GitHub Dark', appearance: 'dark',
    background: '#0d1117', shell: '#010409', raised: '#21262d', card: '#161b22',
    text: '#e6edf3', muted: '#8b949e', faint: '#6e7681', accent: '#2f81f7',
    danger: '#f85149', warning: '#d29922', success: '#3fb950', terminal: '#0d1117',
    ansi: ['#484f58', '#ff7b72', '#3fb950', '#d29922', '#58a6ff', '#bc8cff', '#39c5cf', '#b1bac4', '#6e7681', '#ffa198', '#56d364', '#e3b341', '#79c0ff', '#d2a8ff', '#56d4dd', '#f0f6fc'],
    syntax: ['#8b949e', '#ff7b72', '#a5d6ff', '#79c0ff', '#ffa657', '#d2a8ff', '#7ee787', '#e6edf3', '#b1bac4', '#7ee787', '#ffa657', '#f85149'],
  },
  {
    id: 'zeron-light', name: 'Zeron Light', appearance: 'light',
    background: '#ffffff', shell: '#f3f3f5', raised: '#ededf0', card: '#ffffff',
    text: '#303035', muted: '#62626a', faint: '#797981', accent: '#5b43e8',
    danger: '#dc2626', warning: '#a16207', success: '#15803d', terminal: '#fafafa',
    ansi: ['#1f1f1f', '#dc2626', '#16a34a', '#b45309', '#2563eb', '#9333ea', '#0e7490', '#3f3f46', '#71717a', '#b91c1c', '#15803d', '#92400e', '#1d4ed8', '#7e22ce', '#155e75', '#18181b'],
    syntax: ['#6b7280', '#5b43e8', '#15803d', '#a16207', '#7e22ce', '#2563eb', '#be185d', '#303035', '#52525b', '#be185d', '#0e7490', '#b91c1c'],
  },
  {
    id: 'vscode-light-plus', name: 'Light+', appearance: 'light',
    background: '#ffffff', shell: '#f3f3f3', raised: '#e8e8e8', card: '#ffffff',
    text: '#1f1f1f', muted: '#616161', faint: '#767676', accent: '#0078d4',
    danger: '#a1260d', warning: '#895503', success: '#008000', terminal: '#ffffff',
    ansi: ['#1f1f1f', '#dc2626', '#16a34a', '#b45309', '#2563eb', '#9333ea', '#0e7490', '#3f3f46', '#71717a', '#b91c1c', '#15803d', '#92400e', '#1d4ed8', '#7e22ce', '#155e75', '#18181b'],
    syntax: ['#008000', '#0000ff', '#a31515', '#098658', '#267f99', '#795e26', '#001080', '#1f1f1f', '#1f1f1f', '#800000', '#ff0000', '#cd3131'],
  },
  {
    id: 'catppuccin-latte', name: 'Catppuccin Latte', appearance: 'light',
    background: '#eff1f5', shell: '#e6e9ef', raised: '#dce0e8', card: '#f7f8fa',
    text: '#4c4f69', muted: '#5c5f77', faint: '#6c6f85', accent: '#8839ef',
    danger: '#d20f39', warning: '#df8e1d', success: '#40a02b', terminal: '#eff1f5',
    ansi: ['#5c5f77', '#d20f39', '#40a02b', '#df8e1d', '#1e66f5', '#ea76cb', '#179299', '#acb0be', '#6c6f85', '#d20f39', '#40a02b', '#df8e1d', '#1e66f5', '#ea76cb', '#179299', '#bcc0cc'],
    syntax: ['#8c8fa1', '#8839ef', '#40a02b', '#fe640b', '#df8e1d', '#1e66f5', '#179299', '#4c4f69', '#6c6f85', '#d20f39', '#ea76cb', '#d20f39'],
  },
  {
    id: 'tokyo-night-light', name: 'Tokyo Night Light', appearance: 'light',
    background: '#d5d6db', shell: '#cbccd1', raised: '#bfc0c6', card: '#e1e2e7',
    text: '#343b59', muted: '#485e7d', faint: '#5a6378', accent: '#34548a',
    danger: '#8c4351', warning: '#8f5e15', success: '#33635c', terminal: '#d5d6db',
    ansi: ['#0f0f14', '#8c4351', '#33635c', '#8f5e15', '#34548a', '#5a4a78', '#0f4b6e', '#828594', '#4c505e', '#8c4351', '#33635c', '#8f5e15', '#34548a', '#5a4a78', '#0f4b6e', '#343b59'],
    syntax: ['#6c6e75', '#5a4a78', '#33635c', '#965027', '#0f4b6e', '#34548a', '#166775', '#343b59', '#485e7d', '#8c4351', '#8f5e15', '#8c4351'],
  },
  {
    id: 'github-light', name: 'GitHub Light', appearance: 'light',
    background: '#ffffff', shell: '#f6f8fa', raised: '#d0d7de', card: '#ffffff',
    text: '#1f2328', muted: '#656d76', faint: '#818b98', accent: '#0969da',
    danger: '#cf222e', warning: '#9a6700', success: '#1a7f37', terminal: '#ffffff',
    ansi: ['#24292f', '#cf222e', '#1a7f37', '#9a6700', '#0969da', '#8250df', '#1b7c83', '#6e7781', '#57606a', '#a40e26', '#116329', '#7d4e00', '#0550ae', '#6639ba', '#0a6b74', '#1f2328'],
    syntax: ['#6e7781', '#cf222e', '#0a3069', '#0550ae', '#953800', '#8250df', '#116329', '#1f2328', '#57606a', '#116329', '#953800', '#cf222e'],
  },
]
