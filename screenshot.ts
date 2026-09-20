/**
 * Drive the app like Playwright and write PNG frames of the states that
 * matter. Run with `bun run screenshot`.
 *
 *   screenshots/main.png    default frame (transcript at rest)
 *   screenshots/top.png     transcript scrolled to its first turn
 *   screenshots/picker.png  the HarnessModelPicker open
 *   screenshots/hover.png   a session row under the pointer
 *
 * The motion clock is paused before each capture so every run paints the
 * identical frame.
 */

import { mkdirSync } from 'node:fs'
import path from 'node:path'

import { launch } from '@gpuix/react/automation'

const outDir = process.argv[2] ?? 'screenshots'
mkdirSync(outDir, { recursive: true })

const app = await launch({
  // On Windows a bare "bun" is not spawnable; launch the same executable
  // this script is running under.
  command: process.execPath,
  args: ['app.tsx'],
  // Automation needs the real window, but never needs to interrupt the user.
  env: { GPUIX_BACKGROUND: '1' },
})

await app.getByTestId('composer').waitFor({ timeoutMs: 60_000 })

// Settle every animation, then freeze.
await app.clock.fastForward(600)
await app.clock.pause()

await app.screenshot({ path: path.join(outDir, 'main.png') })

// Top of the transcript: the user bubble, the command row, attachments.
await app.clock.resume()
await app.mouse.wheel(app.getByTestId('transcript'), 0, -6000)
await app.clock.fastForward(400)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'top.png') })

// The HarnessModelPicker open above the composer.
await app.clock.resume()
await app.mouse.wheel(app.getByTestId('transcript'), 0, 6000)
await app.getByTestId('model-picker').click()
await app.clock.fastForward(300)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'picker.png') })

// Back to rest; a session row under the pointer shows the Archive swap.
await app.clock.resume()
await app.getByTestId('model-picker').click()
await app.mouse.move(app.getByTestId('session-row-p1'))
await app.clock.fastForward(400)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'hover.png') })

await app.clock.resume()
await app.close()

console.log(`[screenshot] wrote 4 frames to ${outDir}`)
