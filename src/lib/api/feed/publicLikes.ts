import AtpAgent, {
  type AppBskyFeedDefs,
  type AppBskyFeedLike,
} from '@atproto/api'

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
  agent: AtpAgent
  actor: string
  private pdsAgentPromise: Promise<AtpAgent> | undefined

  constructor({agent, actor}: {agent: AtpAgent; actor: string}) {
    this.agent = agent
    this.actor = actor
  }

  /**
   * Resolve the actor's PDS once and reuse an unauthenticated agent for it
   * across pages. On failure we clear the cache so a later page can retry
   * rather than being stuck with a rejected promise.
   */
  private getPdsAgent(): Promise<AtpAgent> {
    if (!this.pdsAgentPromise) {
      this.pdsAgentPromise = resolvePdsServiceEndpoint(
        this.agent,
        this.actor,
      ).then(service => new AtpAgent({service}))
      this.pdsAgentPromise.catch(() => {
        this.pdsAgentPromise = undefined
      })
    }
    return this.pdsAgentPromise
  }

  async peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost> {
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
    const pdsAgent = await this.getPdsAgent()
    const res = await pdsAgent.com.atproto.repo.listRecords({
      repo: this.actor,
      collection: 'app.bsky.feed.like',
      limit,
      cursor,
    })

    const records = res.data.records
    const uris: string[] = []
    for (const record of records) {
      const value = record.value as AppBskyFeedLike.Record
      const uri = value?.subject?.uri
      if (uri) uris.push(uri)
    }

    const postsByUri = await this.hydratePosts(uris)

    const feed: AppBskyFeedDefs.FeedViewPost[] = []
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
      cursor: records.length === 0 ? undefined : res.data.cursor,
      feed,
    }
  }

  private async hydratePosts(
    uris: string[],
  ): Promise<Map<string, AppBskyFeedDefs.PostView>> {
    const byUri = new Map<string, AppBskyFeedDefs.PostView>()
    for (let i = 0; i < uris.length; i += HYDRATE_CHUNK_SIZE) {
      const chunk = uris.slice(i, i + HYDRATE_CHUNK_SIZE)
      if (chunk.length === 0) continue
      const res = await this.agent.app.bsky.feed.getPosts({uris: chunk})
      for (const post of res.data.posts) {
        byUri.set(post.uri, post)
      }
    }
    return byUri
  }
}

/**
 * Resolve the full PDS service endpoint URL (e.g. "https://bsky.social") that
 * hosts a DID's repo. did:web hostnames are embedded in the DID; did:plc DIDs
 * require reading the DID document via describeRepo.
 */
async function resolvePdsServiceEndpoint(
  agent: AtpAgent,
  did: string,
): Promise<string> {
  if (did.startsWith('did:web:')) {
    const hostname = did.slice('did:web:'.length)
    if (hostname && !hostname.includes(':')) {
      return `https://${hostname}`
    }
  }

  const res = await agent.com.atproto.repo.describeRepo({repo: did})
  const services = (res.data.didDoc as Record<string, unknown>)?.service
  if (Array.isArray(services)) {
    const pds = services.find((s: {id?: string}) => s.id === '#atproto_pds') as
      | {serviceEndpoint?: string}
      | undefined
    if (pds?.serviceEndpoint) {
      return pds.serviceEndpoint
    }
  }

  throw new Error(`Could not resolve hosting PDS for ${did}`)
}
