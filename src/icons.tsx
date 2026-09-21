/**
 * Icon set. stroke icons copied from the GPUIX examples (lucide-flavoured);
 * the Zeron asterisk glyph is hand-drawn (three-tone asterisk mark).
 */

import iconCheck from '../assets/icons/check.svg' with { type: 'text' }
import iconChevronDown from '../assets/icons/chevron-down.svg' with { type: 'text' }
import iconPanelLeft from '../assets/icons/panel-left.svg' with { type: 'text' }
import iconPanelRight from '../assets/icons/panel-right.svg' with { type: 'text' }
import iconArrowLeft from '../assets/icons/arrow-left.svg' with { type: 'text' }
import iconArrowRight from '../assets/icons/arrow-right.svg' with { type: 'text' }
import iconPlus from '../assets/icons/plus.svg' with { type: 'text' }
import iconGitBranch from '../assets/icons/git-branch.svg' with { type: 'text' }
import iconListFilter from '../assets/icons/list-filter.svg' with { type: 'text' }
import iconArrowUp from '../assets/icons/arrow-up.svg' with { type: 'text' }
import iconFolder from '../assets/icons/folder.svg' with { type: 'text' }
import iconSearch from '../assets/icons/search.svg' with { type: 'text' }
import iconSettings from '../assets/icons/settings.svg' with { type: 'text' }
import iconEllipsis from '../assets/icons/ellipsis.svg' with { type: 'text' }
import iconCopy from '../assets/icons/copy.svg' with { type: 'text' }
import iconPencil from '../assets/icons/pencil.svg' with { type: 'text' }
import iconTrash from '../assets/icons/trash.svg' with { type: 'text' }

const iconChevronRight = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m9 18 6-6-6-6"/>
</svg>`

const iconMonitor = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="14" x="2" y="3" rx="2"/>
  <line x1="8" x2="16" y1="21" y2="21"/>
  <line x1="12" x2="12" y1="17" y2="21"/>
</svg>`

const iconGlobe = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
  <path d="M2 12h20"/>
</svg>`

const iconTerminal = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m4 17 6-6-6-6"/>
  <path d="M12 19h8"/>
</svg>`

const iconFile = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
</svg>`

const iconGrid = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="7" height="7" x="3" y="3" rx="1"/>
  <rect width="7" height="7" x="14" y="3" rx="1"/>
  <rect width="7" height="7" x="14" y="14" rx="1"/>
  <rect width="7" height="7" x="3" y="14" rx="1"/>
</svg>`

const iconKey = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m15.5 7.5 3 3L22 7l-3-3"/>
  <path d="m21 2-9.6 9.6"/>
  <circle cx="7.5" cy="15.5" r="5.5"/>
</svg>`

const iconKeyboard = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="16" x="2" y="4" rx="2"/>
  <path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/>
  <path d="M6 12h.01"/><path d="M18 12h.01"/><path d="M9 12h6"/><path d="M9 16h6"/>
</svg>`

const iconArchive = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="5" x="2" y="3" rx="1"/>
  <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
  <path d="M10 12h4"/>
</svg>`

const iconPaperclip = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
</svg>`

const ICONS = {
  check: iconCheck,
  chevronDown: iconChevronDown,
  panelLeft: iconPanelLeft,
  panelRight: iconPanelRight,
  arrowLeft: iconArrowLeft,
  arrowRight: iconArrowRight,
  plus: iconPlus,
  gitBranch: iconGitBranch,
  listFilter: iconListFilter,
  arrowUp: iconArrowUp,
  folder: iconFolder,
  monitor: iconMonitor,
  globe: iconGlobe,
  terminal: iconTerminal,
  file: iconFile,
  grid: iconGrid,
  key: iconKey,
  keyboard: iconKeyboard,
  archive: iconArchive,
  search: iconSearch,
  settings: iconSettings,
  ellipsis: iconEllipsis,
  paperclip: iconPaperclip,
  copy: iconCopy,
  pencil: iconPencil,
  trash: iconTrash,
  chevronRight: iconChevronRight,
} as const

export type IconName = keyof typeof ICONS

export function Icon({ name, size = 14, color }: { name: IconName; size?: number; color: string }) {
  return (
    <svg
      source={ICONS[name]}
      style={{ width: size, height: size, flexShrink: 0, color, pointerEvents: 'none' }}
    />
  )
}

/**
 * The Zeron asterisk glyph (the orange/red starburst seen next to session
 * titles and in the model chip). Drawn as an inline 8-spoke asterisk SVG.
 */
export function ZeronGlyph({ size = 13, color = '#e2795b' }: { size?: number; color?: string }) {
  const s = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <g stroke="currentColor" stroke-width="2.1" stroke-linecap="round">
    <line x1="12" y1="2.5" x2="12" y2="21.5"/>
    <line x1="2.5" y1="12" x2="21.5" y2="12"/>
    <line x1="5.3" y1="5.3" x2="18.7" y2="18.7"/>
    <line x1="18.7" y1="5.3" x2="5.3" y2="18.7"/>
  </g>
</svg>`
  return <svg source={s} style={{ width: size, height: size, flexShrink: 0, color }} />
}
