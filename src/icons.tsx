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
