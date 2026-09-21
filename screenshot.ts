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

// Startup screen: clear to the blank hero canvas (the + new-session button),
// settle the dock→hero glide, freeze, and capture the centered composer.
await app.getByTestId('new-session').click()
await app.clock.fastForward(600)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'hero.png') })

// Hero target selectors: open the device picker dropdown on the blank canvas.
await app.clock.resume()
await app.getByTestId('picker-device').click()
await app.clock.fastForward(300)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'hero-device-picker.png') })
// Dismiss the picker before continuing.
await app.clock.resume()
await app.getByTestId('picker-device').click()
await app.clock.fastForward(200)

// Send a prompt: the hero composer shrinks down to the compact dock.
await app.clock.resume()
await app.getByTestId('composer').fill('Analyse this folder and give me an overview')
await app.getByTestId('composer').press('enter')
// Mid-glide frame (~half the 420ms NEW_THREAD_TRANSITION) proves the composer
// animates between the two states instead of snapping.
await app.clock.fastForward(180)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'mid-glide.png') })
await app.clock.resume()
await app.clock.fastForward(420)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'docked.png') })

// Sidebar spaces dropdown ("All projects").
await app.clock.resume()
await app.getByTestId('spaces-filter').click()
await app.clock.fastForward(300)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'spaces.png') })
await app.clock.resume()
await app.getByTestId('spaces-filter').click()
await app.clock.fastForward(200)

// Right-pane surface picker (Changes / Files / Browser / Terminal).
await app.getByTestId('surface-picker').click()
await app.clock.fastForward(300)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'surface-picker.png') })
await app.clock.resume()
await app.getByTestId('surface-picker').click()
await app.clock.fastForward(200)

// Settle every animation, then freeze.
await app.clock.resume()
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

// Profile menu → Settings view (Agents section), then back.
await app.clock.resume()
await app.getByTestId('profile-menu').click()
await app.clock.fastForward(300)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'profile-menu.png') })
await app.clock.resume()
await app.getByTestId('profile-menu-settings').click()
await app.clock.fastForward(400)
await app.clock.pause()
await app.screenshot({ path: path.join(outDir, 'settings.png') })


await app.clock.resume()
await app.close()

console.log(`[screenshot] wrote 4 frames to ${outDir}`)
