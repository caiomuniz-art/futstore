import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const node = process.execPath
const root = fileURLToPath(new URL('..', import.meta.url))
const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const server = fileURLToPath(new URL('./index.js', import.meta.url))

function run(args, name) {
  const child = spawn(node, args, { cwd: root, stdio: 'inherit' })
  child.on('exit', (code) => {
    if (code) console.error(`${name} encerrou com código ${code}`)
  })
  return child
}

const api = run(['--watch', server], 'api')
const web = run([vite], 'vite')

function shutdown() {
  api.kill()
  web.kill()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
