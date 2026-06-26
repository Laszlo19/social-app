import {readAsStringAsync, EncodingType} from 'expo-file-system/legacy'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemini-flash-1.5'
const PROMPT =
  'Write concise alt text for this image. 1-2 sentences, factual and descriptive, suitable for screen readers. Do not start with "Image of" or "A photo of".'

export async function generateAltTextViaOpenRouter(
  imagePath: string,
  apiKey: string,
): Promise<string> {
  // Read the local image file as base64
  const base64 = await readAsStringAsync(imagePath, {
    encoding: EncodingType.Base64,
  })
  const dataUrl = `data:image/jpeg;base64,${base64}`

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://bsky.app',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            {type: 'image_url', image_url: {url: dataUrl}},
            {type: 'text', text: PROMPT},
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText)
    throw new Error(`OpenRouter error ${response.status}: ${err}`)
  }

  const json = (await response.json()) as {
    choices?: {message?: {content?: string}}[]
    error?: {message?: string}
  }

  if (json.error?.message) {
    throw new Error(json.error.message)
  }

  const text = json.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty response from OpenRouter')

  return text
}
