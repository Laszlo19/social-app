/**
 * Runtime pseudolocalization.
 *
 * Lingui compiles catalogs into a tokenized format where each message is either
 * a plain string or an array of tokens (literal strings and placeholder arrays
 * like ['name'] or ['count', 'plural', {one: '# item', other: '# items'}]).
 *
 * We transform the English catalog at runtime rather than generating dedicated
 * pseudo catalogs, so this works with the existing `intl:compile` step and no
 * extraction. Only literal text is accented/expanded; placeholder names and
 * format identifiers are left intact so interpolation keeps working.
 */

const ACCENTS: Record<string, string> = {
  a: 'à',
  b: 'ƀ',
  c: 'ç',
  d: 'ð',
  e: 'è',
  f: 'ƒ',
  g: 'ĝ',
  h: 'ĥ',
  i: 'ì',
  j: 'ĵ',
  k: 'ķ',
  l: 'ļ',
  m: 'ɱ',
  n: 'ñ',
  o: 'ò',
  p: 'þ',
  q: 'ǫ',
  r: 'ŕ',
  s: 'š',
  t: 'ţ',
  u: 'ù',
  v: 'ṽ',
  w: 'ŵ',
  x: ' x',
  y: 'ý',
  z: 'ž',
  A: 'À',
  B: 'Ɓ',
  C: 'Ç',
  D: 'Ð',
  E: 'È',
  F: 'Ƒ',
  G: 'Ĝ',
  H: 'Ĥ',
  I: 'Ì',
  J: 'Ĵ',
  K: 'Ķ',
  L: 'Ļ',
  M: 'Ɱ',
  N: 'Ñ',
  O: 'Ò',
  P: 'Þ',
  Q: 'Ǫ',
  R: 'Ŕ',
  S: 'Š',
  T: 'Ţ',
  U: 'Ù',
  V: 'Ṽ',
  W: 'Ŵ',
  X: 'X',
  Y: 'Ý',
  Z: 'Ž',
}

function accentString(input: string): string {
  let out = ''
  for (const char of input) {
    out += ACCENTS[char] ?? char
  }
  return out
}

type Token = string | unknown[]
type CompiledMessage = string | Token[]
type Catalog = Record<string, CompiledMessage>

function transformMessage(msg: CompiledMessage): CompiledMessage {
  if (typeof msg === 'string') return accentString(msg)
  if (Array.isArray(msg)) return msg.map(transformToken)
  return msg
}

function transformToken(token: Token): Token {
  // Literal text segment.
  if (typeof token === 'string') return accentString(token)

  // Placeholder: [name, format?, options?]. Do not touch name/format; only
  // pseudolocalize the option message values (e.g. plural/select branches).
  if (Array.isArray(token)) {
    const [name, format, options] = token
    if (options && typeof options === 'object' && !Array.isArray(options)) {
      const newOptions: Record<string, unknown> = {}
      for (const key of Object.keys(options as Record<string, unknown>)) {
        newOptions[key] = transformMessage(
          (options as Record<string, CompiledMessage>)[key],
        )
      }
      return [name, format, newOptions]
    }
    return token
  }

  return token
}

let cached: Catalog | null = null

/**
 * Pseudolocalize a full compiled catalog. Cached because the catalog is large
 * and only the English source is ever transformed.
 */
export function pseudolocalizeCatalog(messages: Catalog): Catalog {
  if (cached) return cached
  const out: Catalog = {}
  for (const id of Object.keys(messages)) {
    out[id] = transformMessage(messages[id])
  }
  cached = out
  return out
}
