import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('CloudBase SPA fallback', () => {
  it('builds a 404 page that matches the SPA entry document', () => {
    execSync('npm run build', { cwd: process.cwd(), stdio: 'pipe' })

    const indexPath = join(process.cwd(), 'dist', 'index.html')
    const fallbackPath = join(process.cwd(), 'dist', '404.html')

    expect(existsSync(fallbackPath)).toBe(true)
    expect(readFileSync(fallbackPath, 'utf8')).toBe(
      readFileSync(indexPath, 'utf8'),
    )
  })
})
