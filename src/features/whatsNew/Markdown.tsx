import {Fragment} from 'react'
import {View} from 'react-native'

import {atoms as a, platform, useTheme} from '#/alf'
import {InlineLinkText} from '#/components/Link'
import {Text} from '#/components/Typography'

/**
 * Minimal Markdown renderer for the changelog. Supports the deliberately small
 * subset the changelog files use: headings (#/##/###), bullet lists (-/*),
 * **bold**, *italic*, `code`, and [links](href). Anything else renders as plain
 * text rather than failing. Changelog Markdown is authored in-repo, so we
 * control the subset.
 */

type Block =
  | {type: 'heading'; level: number; text: string}
  | {type: 'list'; items: string[]}
  | {type: 'paragraph'; text: string}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let para: string[] = []
  let list: string[] = []

  const flushPara = () => {
    if (para.length) {
      blocks.push({type: 'paragraph', text: para.join(' ')})
      para = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push({type: 'list', items: list})
      list = []
    }
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '')
    if (line.trim() === '') {
      flushPara()
      flushList()
      continue
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      flushPara()
      flushList()
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        text: heading[2].trim(),
      })
      continue
    }
    const item = /^\s*[-*]\s+(.*)$/.exec(line)
    if (item) {
      flushPara()
      list.push(item[1].trim())
      continue
    }
    flushList()
    para.push(line.trim())
  }
  flushPara()
  flushList()
  return blocks
}

// **bold** | *italic* | `code` | [text](href)
const INLINE_RE =
  /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g

const codeStyle = platform({
  ios: {fontFamily: 'Courier New'},
  android: {fontFamily: 'monospace'},
  web: {fontFamily: 'monospace'},
})

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  let i = 0
  let m: RegExpExecArray | null
  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) {
      nodes.push(
        <Fragment key={`${keyBase}-t${i++}`}>
          {text.slice(last, m.index)}
        </Fragment>,
      )
    }
    if (m[2] !== undefined) {
      nodes.push(
        <Text key={`${keyBase}-b${i++}`} style={[a.font_bold]}>
          {m[2]}
        </Text>,
      )
    } else if (m[3] !== undefined) {
      nodes.push(
        <Text key={`${keyBase}-i${i++}`} style={[{fontStyle: 'italic'}]}>
          {m[3]}
        </Text>,
      )
    } else if (m[4] !== undefined) {
      nodes.push(
        <Text key={`${keyBase}-c${i++}`} style={[codeStyle]}>
          {m[4]}
        </Text>,
      )
    } else if (m[5] !== undefined) {
      nodes.push(
        <InlineLinkText key={`${keyBase}-l${i++}`} to={m[6]} label={m[5]}>
          {m[5]}
        </InlineLinkText>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) {
    nodes.push(
      <Fragment key={`${keyBase}-t${i++}`}>{text.slice(last)}</Fragment>,
    )
  }
  return nodes
}

export function Markdown({source}: {source: string}) {
  const t = useTheme()
  const blocks = parseBlocks(source)

  return (
    <View style={[a.gap_md]}>
      {blocks.map((block, idx) => {
        const key = `b${idx}`
        if (block.type === 'heading') {
          const size =
            block.level <= 1
              ? a.text_2xl
              : block.level === 2
                ? a.text_xl
                : a.text_lg
          return (
            <Text key={key} style={[size, a.font_bold]}>
              {renderInline(block.text, key)}
            </Text>
          )
        }
        if (block.type === 'list') {
          return (
            <View key={key} style={[a.gap_xs]}>
              {block.items.map((it, j) => (
                <View key={`${key}-${j}`} style={[a.flex_row, a.gap_sm]}>
                  <Text
                    style={[a.text_md, a.leading_snug, t.atoms.text_contrast_medium]}>
                    {'•'}
                  </Text>
                  <Text style={[a.text_md, a.leading_snug, a.flex_1]}>
                    {renderInline(it, `${key}-${j}`)}
                  </Text>
                </View>
              ))}
            </View>
          )
        }
        return (
          <Text key={key} style={[a.text_md, a.leading_snug]}>
            {renderInline(block.text, key)}
          </Text>
        )
      })}
    </View>
  )
}
