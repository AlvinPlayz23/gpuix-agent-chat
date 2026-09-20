/**
 * The branch-changes pane (comet crates/ui/src/changes.rs, right of the
 * transcript in apps/landing/public/assets/app-screenshot.jpg): a branch
 * selector, a changed-file summary, and file-by-file diffs. The diff itself is
 * GPUIX's native <diff>, which flows inside this pane's own scroller.
 */

import { motion } from '@gpuix/react'
import { C, POPOVER_TRANSITION, TEXT_SM, TEXT_XS } from './theme'
import { Icon } from './icons'

const PATCH = `diff --git a/crates/ui/src/composer.rs b/crates/ui/src/composer.rs
@@ -118,7 +118,9 @@ pub fn composer_dock(...) {
     let chip = model_chip(&config);
     row.child(chip)
-       .child(reasoning_chip(&config));
+       .child(reasoning_chip(&config))
+       .child(context_meter(&config))
+       .child(send_button(&config));
 }
diff --git a/crates/ui/src/shell.rs b/crates/ui/src/shell.rs
@@ -699,6 +699,9 @@ fn sidebar_row_height(compact: bool, show_label: bool, branch: bool, pr: bool) -> f32 {
     if compact {
         29.0
     } else {
-        chat_row_height(branch, pr)
+        // The label line is part of the row, so hiding it shrinks the card by
+        // exactly one 16px line instead of leaving a gap in the list.
+        chat_row_height(branch, pr) - if show_label { 0.0 } else { 16.0 }
     }
 }
`

export function ChangesPane({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 420 }}
      transition={POPOVER_TRANSITION}
      style={{ flexShrink: 0, overflow: 'hidden', height: '100%' }}
    >
      <div
        style={{
          width: 420,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.background,
          borderLeftWidth: 1,
          borderColor: C.border,
        }}
      >
        <ChangesHeader onClose={onClose} />
        <ChangesSummary />
        <ChangesList />
      </div>
    </motion.div>
  )
}

function ChangesHeader({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 40,
        flexShrink: 0,
        paddingLeft: 12,
        paddingRight: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 26,
          paddingLeft: 8,
          paddingRight: 6,
          borderRadius: 7,
          backgroundColor: C.wash0,
          borderWidth: 1,
          borderColor: C.border,
          cursor: 'pointer',
          flexShrink: 0,
          hover: { backgroundColor: C.hover },
        }}
      >
        <text style={{ fontSize: 12, color: C.text, whiteSpace: 'nowrap' }}>Branch changes</text>
        <Icon name="chevronDown" size={11} color={C.textFaint} />
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, flexShrink: 1, minWidth: 0 }}
      >
        <Icon name="gitBranch" size={12} color={C.textFaint} />
        <text style={{ fontSize: 12, color: C.textMuted, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          comet/takeover-claude
        </text>
      </div>
      <div style={{ flexGrow: 1 }} />
      <div
        onClick={onClose}
        testId="changes-close"
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          hover: { backgroundColor: C.hover },
        }}
      >
        <Icon name="panelRight" size={14} color={C.textMuted} />
      </div>
    </div>
  )
}

function ChangesSummary() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 28,
        flexShrink: 0,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <text style={{ fontSize: 12, color: C.textMuted }}>80 Changed files</text>
      <text style={{ fontSize: 12, color: C.textFaint }}>vs chat2-c3</text>
      <text style={{ fontSize: 12, color: C.success }}>+9341</text>
      <text style={{ fontSize: 12, color: C.danger }}>-3630</text>
    </div>
  )
}


function ChangesList() {
  return (
    <div
      style={{
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'scroll',
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 12,
      }}
    >
      <FileRow path="crates/ui/src/composer.rs" added={2} removed={0} />
      <FileRow path="crates/ui/src/shell.rs" added={3} removed={1} />
      <div
        style={{
          marginTop: 6,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: C.border,
          overflow: 'hidden',
        }}
      >
        <diff
          patch={PATCH}
          wordDiff
          theme={{
            appearance: 'dark',
            metrics: { diffLineHeight: 19, diffFileHeaderHeight: 32, diffGutterWidth: 44 },
          }}
          style={{ fontSize: 11.5, backgroundColor: '#00000000' }}
        />
      </div>
    </div>
  )
}

function FileRow({ path, added, removed }: { path: string; added: number; removed: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 30,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        cursor: 'pointer',
        hover: { backgroundColor: C.hover },
      }}
    >
      <Icon name="chevronDown" size={11} color={C.textFaint} />
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <text style={{ fontSize: TEXT_SM, color: C.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {path}
        </text>
      </div>
      <text style={{ fontSize: TEXT_XS, color: C.success }}>{`+${added}`}</text>
      <text style={{ fontSize: TEXT_XS, color: C.danger }}>{`-${removed}`}</text>
    </div>
  )
}
