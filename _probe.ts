import { launch } from '@gpuix/react/automation'

const app = await launch({
  command: process.execPath,
  args: ['app.tsx'],
  env: { GPUIX_BACKGROUND: '1' },
})

await app.getByTestId('composer').waitFor({ timeoutMs: 60_000 })

// We boot on the hero canvas now. Fill the composer and inspect.
const composer = app.getByTestId('composer')
await composer.click()
await composer.fill('hello world')
await app.clock.fastForward(300)

const all = await app.getByTestId('composer').all()
console.log('composer nodes:', JSON.stringify(all, null, 2).slice(0, 800))

const texts = await app.call('getAllText', {})
console.log('painted/all text contains hello?', JSON.stringify(texts).includes('hello'))

await app.close()
