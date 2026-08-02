import { copyFileSync } from 'node:fs'

const distDirectory = new URL('../dist/', import.meta.url)

copyFileSync(
  new URL('index.html', distDirectory),
  new URL('404.html', distDirectory),
)
