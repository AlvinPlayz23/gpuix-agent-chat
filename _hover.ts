import { launch } from '@gpuix/react/automation'

const app = await launch({
  command: process.execPath,
  args: ['app.tsx'],
  env: { GPUIX_BACKGROUND: '1' },
})

await app.getByTestId('composer').waitFor({ timeoutMs: 60_000 })

// Focused window: hover needs an active window to enter rows.
await app.call('focusWindow', {}).catch(() => {})

// Dock first (session s7 selected at boot, but boot is hero — click a row).
await app.getByTestId('session-row-p1').click()
await app.clock.fastForward(600)
await app.clock.pause()

const before = await app.screenshot({ path: 'screenshots/_probe-rest.png' })
await app.clock.resume()
await app.getByTestId('session-row-p1').hover()
await app.clock.fastForward(400)
await app.clock.pause()
const after = await app.screenshot({ path: 'screenshots/_probe-hover.png' })

// The row's hover swaps the corner for the Archive chip.
const texts = await app.call('getAllText', {})
console.log('archive visible?', JSON.stringify(texts).includes('Archive'))
console.log('frames:', before, after)

await app.close()
