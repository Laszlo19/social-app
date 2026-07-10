/*
 * Compiles the Markdown changelog files under changelog/<locale>/<version>.md
 * into a single committed TS module the app imports at runtime
 * (src/features/whatsNew/changelog.generated.ts).
 *
 * Metro can't import .md directly and we avoid a runtime markdown dependency, so
 * this mirrors the i18n compile step: source files -> generated runtime module.
 * Run via `node scripts/build-changelog.mjs` (in CI, like intl:compile). The
 * generated file is committed so builds work without running the script.
 *
 * Version ordering comes from the en/ folder (source of truth), newest first.
 */
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const changelogDir = join(root, 'changelog')
const outFile = join(
  root,
  'src',
  'features',
  'whatsNew',
  'changelog.generated.ts',
)

/** Descending semver-ish compare (numeric, dot-separated). */
function compareVersionsDesc(a, b) {
  const pa = a.split('.').map(n => parseInt(n, 10) || 0)
  const pb = b.split('.').map(n => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pb[i] || 0) - (pa[i] || 0)
    if (d !== 0) return d
  }
  return 0
}

function isDir(p) {
  try {
    return statSync(p).isDirectory()
  } catch {
    return false
  }
}

// entries: {version: {locale: markdown}}
const entries = {}
const locales = readdirSync(changelogDir).filter(d =>
  isDir(join(changelogDir, d)),
)
for (const locale of locales) {
  const localeDir = join(changelogDir, locale)
  for (const file of readdirSync(localeDir)) {
    if (!file.endsWith('.md')) continue
    const version = file.slice(0, -3)
    const md = readFileSync(join(localeDir, file), 'utf8').replace(/\r\n/g, '\n')
    entries[version] = entries[version] || {}
    entries[version][locale] = md
  }
}

// The set (and order) of versions is defined by the English source folder.
const enDir = join(changelogDir, 'en')
const versions = readdirSync(enDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.slice(0, -3))
  .sort(compareVersionsDesc)

const banner = `/*
 * GENERATED FILE - do not edit by hand.
 * Regenerate with: node scripts/build-changelog.mjs
 * Source: changelog/<locale>/<version>.md
 */
`

const body =
  banner +
  '\n' +
  `export const CHANGELOG_VERSIONS: string[] = ${JSON.stringify(
    versions,
    null,
    2,
  )}\n\n` +
  '/** version -> locale -> markdown source */\n' +
  `export const CHANGELOG: Record<string, Record<string, string>> = ${JSON.stringify(
    entries,
    null,
    2,
  )}\n`

writeFileSync(outFile, body)
// eslint-disable-next-line no-console
console.log(
  `[build-changelog] wrote ${outFile} (${versions.length} versions, ${locales.length} locales)`,
)
