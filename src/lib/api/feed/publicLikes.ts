import {type Client} from '@atproto/lex'
import {type DidDocument, getPdsEndpoint} from '@atproto/common-web'

import {app} from '#/lexicons'
import {type FeedAPI, type FeedAPIResponse} from './types'

/**
 * getPosts hydrates at most 25 URIs per call.
 */
const HYDRATE_CHUNK_SIZE = 25

/**
 * Feed of another actor's likes, read from public `app.bsky.feed.like` records.
 *
 * The AppView's `getActorLikes` is gated to the authenticated user, so it can't
 * back a "Likes" tab on other profiles. Like records are public in each repo,
 * though, so this reads them directly:
 *
 * 1. resolve the actor's hosting PDS (com.atproto.repo endpoints are served by
 *    the repo's own PDS, not the viewer's),
 * 2. `listRecords` the like collection to get liked-post URIs (newest first -
 *    like rkeys are time-sortable TIDs),
 * 3. hydrate those URIs via the viewer's AppView `getPosts`, so the resulting
 *    PostViews carry the viewer's moderation/block state.
 *
 * Pages can have gaps where a liked post was deleted or is unavailable to the
 * viewer; those are simply omitted.
 */
export class PublicActorLikesFeedAPI implements FeedAPI {
  client: Client
  actor: string
  private pdsUrlPromise: Promise<string> | undefined

  constructor({client, actor}: {client: Client; actor: string}) {
    this.client = client
    this.actor = actor
  }

  /**
   * Resolve the actor's PDS URL once and reuse it across pages. On failure we
   * clear the cache so a later page can retry rather than being stuck with a
   * rejected promise.
   */
  private getPdsUrl(): Promise<string> {
    if (!this.pdsUrlPromise) {
      this.pdsUrlPromise = resolvePdsServiceEndpoint(this.actor)
      this.pdsUrlPromise.catch(() => {
        this.pdsUrlPromise = undefined
      })
    }
    return this.pdsUrlPromise
  }

  async peekLatest(): Promise<app.bsky.feed.defs.FeedViewPost> {
    const res = await this.fetch({cursor: undefined, limit: 1})
    return res.feed[0]
  }

  async fetch({
    cursor,
    limit,
  }: {
    cursor: string | undefined
    limit: number
  }): Promise<FeedAPIResponse> {
    const pdsUrl = await this.getPdsUrl()
    const res = await listLikeRecords(pdsUrl, this.actor, limit, cursor)

    const uris: string[] = []
    for (const record of res.records) {
      const value = record.value as {subject?: {uri?: string}}
      const uri = value?.subject?.uri
      if (uri) uris.push(uri)
    }

    const postsByUri = await this.hydratePosts(uris)

    const feed: app.bsky.feed.defs.FeedViewPost[] = []
    for (const uri of uris) {
      const post = postsByUri.get(uri)
      // Skip likes whose subject is deleted or unavailable to this viewer.
      if (post) feed.push({post})
    }

    return {
      /*
       * Mirror LikesFeedAPI: the API can return a cursor even when a page is
       * empty, so drop it to avoid paginating forever.
       */
      cursor: res.records.length === 0 ? undefined : res.cursor,
      feed,
    }
  }

  /**
   * getPosts is capped at 25 URIs per call and runs through the viewer's
   * AppView, so the returned PostViews carry the viewer's moderation state.
   */
  private async hydratePosts(
    uris: string[],
  ): Promise<Map<string, app.bsky.feed.defs.PostView>> {
    const byUri = new Map<string, app.bsky.feed.defs.PostView>()
    for (let i = 0; i < uris.length; i += HYDRATE_CHUNK_SIZE) {
      const chunk = uris.slice(i, i + HYDRATE_CHUNK_SIZE)
      if (chunk.length === 0) continue
      const data = await this.client.call(app.bsky.feed.getPosts, {uris: chunk})
      for (const post of data.posts) {
        byUri.set(post.uri, post)
      }
    }
    return byUri
  }
}

/**
 * Unauthenticated `com.atproto.repo.listRecords` against the actor's own PDS.
 * The lex client is bound to the viewer's AppView, and repo endpoints are only
 * served by the repo's hosting PDS, so this hits the resolved PDS directly.
 */
async function listLikeRecords(
  pdsUrl: string,
  repo: string,
  limit: number,
  cursor: string | undefined,
): Promise<{records: {uri: string; value: unknown}[]; cursor?: string}> {
  const url = new URL('/xrpc/com.atproto.repo.listRecords', pdsUrl)
  url.searchParams.set('repo', repo)
  url.searchParams.set('collection', 'app.bsky.feed.like')
  url.searchParams.set('limit', String(limit))
  if (cursor) url.searchParams.set('cursor', cursor)
  const res = await fetch(url.toString(), {
    headers: {accept: 'application/json'},
  })
  if (!res.ok) {
    throw new Error(`listRecords failed for ${repo}: ${res.status}`)
  }
  return (await res.json()) as {
    records: {uri: string; value: unknown}[]
    cursor?: string
  }
}

/**
 * Resolve the full PDS service endpoint URL (e.g. "https://bsky.social") that
 * hosts a DID's repo, by reading its DID document: did:plc via the PLC
 * directory, did:web via its `.well-known/did.json`. Mirrors the login-time
 * resolution in state/queries/pds-detection.ts.
 */
async function resolvePdsServiceEndpoint(did: string): Promise<string> {
  const doc = await resolveDidDoc(did)
  const pds = doc ? getPdsEndpoint(doc) : undefined
  if (!pds) {
    throw new Error(`Could not resolve hosting PDS for ${did}`)
  }
  return pds
}

async function resolveDidDoc(did: string): Promise<DidDocument | null> {
  if (did.startsWith('did:plc:')) {
    const res = await fetch(`https://plc.directory/${did}`)
    if (!res.ok) return null
    return (await res.json()) as DidDocument
  }
  if (did.startsWith('did:web:')) {
    const domain = did.slice('did:web:'.length)
    // A `:` denotes a path component, which the network does not support.
    if (domain.includes(':')) return null
    const res = await fetch(
      `https://${decodeURIComponent(domain)}/.well-known/did.json`,
    )
    if (!res.ok) return null
    return (await res.json()) as DidDocument
  }
  return null
}
