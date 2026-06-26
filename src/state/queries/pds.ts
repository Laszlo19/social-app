import {useQuery} from '@tanstack/react-query'

import {createQueryKey} from '#/state/queries/util'
import {useAgent} from '#/state/session'
import {STALE} from '.'

const pdsFromProfileQueryKeyRoot = 'pdsFromProfile'

const createPdsFromProfileQueryKey = (did: string) =>
  createQueryKey(pdsFromProfileQueryKeyRoot, {did})

/**
 * Resolves the hosting PDS URL for a given DID by calling describeRepo and
 * extracting the #atproto_pds service endpoint from the DID document.
 *
 * For did:web DIDs the hostname can be inferred without a network call; for
 * did:plc the DID document must be fetched.
 *
 * Returns only the hostname (e.g. "bsky.social") suitable for display.
 */
export function usePdsFromProfileQuery(did: string | undefined) {
  const agent = useAgent()

  return useQuery({
    queryKey: createPdsFromProfileQueryKey(did ?? ''),
    enabled: !!did,
    staleTime: STALE.HOURS.ONE,
    queryFn: async () => {
      if (!did) return null

      // did:web — hostname is embedded in the DID itself
      if (did.startsWith('did:web:')) {
        const hostname = did.slice('did:web:'.length)
        return hostname || null
      }

      const res = await agent.api.com.atproto.repo.describeRepo({repo: did})
      const services = (res.data.didDoc as Record<string, unknown>)?.service
      if (!Array.isArray(services)) return null

      const pdsSvc = services.find(
        (s: {id?: string}) => s.id === '#atproto_pds',
      ) as {serviceEndpoint?: string} | undefined

      if (!pdsSvc?.serviceEndpoint) return null

      try {
        return new URL(pdsSvc.serviceEndpoint).hostname
      } catch {
        return null
      }
    },
  })
}
