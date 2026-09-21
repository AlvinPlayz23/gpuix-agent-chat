/**
 * Dropdown menus built on GPUIX's headless Select (positioning, keyboard nav,
 * and outside-click dismissal come from the platform layer). Shared by the
 * hero target selectors (device / workspace), the sidebar spaces dropdown, and
 * the titlebar's right-pane surface picker.
 *
 * Visual language mirrors comet's popover.rs popover_card on the `for_popup`
 * theme: an `overlay` card with a 10–12px radius, a hairline border, and rows
 * that take the `hover` wash. The card fades in over POPOVER_TRANSITION.
 */

import type { ReactNode } from 'react'
import { motion, Select, SelectContent, SelectItem, SelectTrigger } from '@gpuix/react'
import { C, POPOVER_TRANSITION, TEXT_MD, TEXT_SM } from './theme'
import { Icon, type IconName } from './icons'

export interface MenuOption {
  value: string
  label: string
  icon?: IconName
  /** Muted right-hand hint (device online state, branch, etc.). */
  hint?: string
}

/**
 * A dropdown menu. `trigger` renders the chip/button; the card floats on
 * `side` (default bottom). Selection calls `onSelect` with the option value.
 */
export function Menu({
  value,
  options,
  onSelect,
  trigger,
  side = 'bottom',
  sideOffset = 6,
  width = 224,
  testId,
}: {
  value: string
  options: MenuOption[]
  onSelect: (value: string) => void
  trigger: ReactNode
  side?: 'top' | 'bottom'
  sideOffset?: number
  width?: number
  testId?: string
}) {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger asChild testId={testId}>
        {trigger}
      </SelectTrigger>
      <SelectContent side={side} sideOffset={sideOffset}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={POPOVER_TRANSITION}
          style={{
            width,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: 4,
            backgroundColor: C.overlay,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} asChild>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  height: 30,
                  paddingLeft: 8,
                  paddingRight: 8,
                  borderRadius: 8,
                  cursor: 'pointer',
                  hover: { backgroundColor: C.hover },
                }}
              >
                {option.icon && <Icon name={option.icon} size={13} color={C.textMuted} />}
                <text style={{ fontSize: TEXT_SM, color: C.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {option.label}
                </text>
                <div style={{ flexGrow: 1 }} />
                {option.hint && (
                  <text style={{ fontSize: TEXT_SM, color: C.textFaint, whiteSpace: 'nowrap' }}>{option.hint}</text>
                )}
                {option.value === value && <Icon name="check" size={12} color={C.accent} />}
              </div>
            </SelectItem>
          ))}
        </motion.div>
      </SelectContent>
    </Select>
  )
}

/** The chip used by the hero target selectors and inline pickers. Forwards
 *  extra props (testId, handlers) so Select's asChild trigger merge lands on
 *  the host element. */
export function PickerChip({
  icon,
  label,
  muted,
  ...rest
}: {
  icon: IconName
  label: string
  muted?: boolean
} & Record<string, unknown>) {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 7,
        cursor: 'pointer',
        hover: { backgroundColor: C.hover },
      }}
    >
      <Icon name={icon} size={12} color={muted ? C.textMuted : C.textFaint} />
      <text style={{ fontSize: TEXT_MD, color: muted ? C.text : C.textMuted, whiteSpace: 'nowrap' }}>{label}</text>
      <Icon name="chevronDown" size={11} color={C.textFaint} />
    </div>
  )
}
