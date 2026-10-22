import {type DidString} from '@atproto/syntax'
import {useLingui} from '@lingui/react/macro'
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {MOD_PROXY_SERVICE} from '#/lib/constants'
import {isNetworkError} from '#/lib/strings/errors'
import {matchXrpcError} from '#/lib/xrpc-error'
import {logger} from '#/logger'
import {STALE} from '#/state/queries'
import {
  appealTestSubject,
  getTestAccountStatus,
  getTestReport,
  getTestSubject,
  getTestUnreadCount,
  listTestReports,
  listTestSubjects,
  markTestSeen,
  resetTestModerationInbox,
} from '#/state/queries/moderation-inbox-test-data'
import {createQueryKey} from '#/state/queries/util'
import {useAppviewClient, useSession} from '#/state/session'
import {device, useStorage} from '#/storage'
import * as Toast from '#/components/Toast'
import {tools} from '#/lexicons'

const QUERY_KEY_ROOT = 'moderation-inbox'

/**
 * Fork: whether the inbox reads sample data instead of the moderation service
 * (Settings > Beta features > Moderation inbox), and the account standing the
 * sample data reports. See `moderation-inbox-test-data.ts`.
 */
function useTestInbox() {
  const [testData] = useStorage(device, ['modInboxTestData'])
  const [standing] = useStorage(device, ['modInboxTestAccountStatus'])
  return {testData: !!testData, standing: standing ?? 'warning'}
}

/**
 * Fork: puts the inbox sample data back to its starting read and appeal state,
 * and reloads anything showing it.
 */
export function useResetTestModerationInbox() {
  const queryClient = useQueryClient()
  return async () => {
    resetTestModerationInbox()
    await queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOT]})
  }
}

type ReportsFilter = NonNullable<
  tools.ozone.inbox.listReports.$Params['filter']
>
type ActionedSubjectsFilter = NonNullable<
  tools.ozone.inbox.listActionedSubjects.$Params['filter']
>

export function useModerationInboxReportsQuery(filter: ReportsFilter) {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did
  const {testData} = useTestInbox()

  return useInfiniteQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'reports',
      filter,
      testData,
    }),
    queryFn: async ({pageParam}) =>
      testData
        ? listTestReports({filter, cursor: pageParam, limit: 25})
        : await client.call(
            tools.ozone.inbox.listReports,
            {filter, limit: 100, cursor: pageParam},
            {service: MOD_PROXY_SERVICE},
          ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.cursor,
    staleTime: STALE.MINUTES.ONE,
    enabled: hasSession && !!did,
  })
}

export function useModerationInboxReportQuery({
  moderationService,
  id,
  enabled = true,
}: {
  moderationService?: DidString
  id?: number
  enabled?: boolean
}) {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did
  const {testData} = useTestInbox()

  return useQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'report',
      moderationService,
      id,
      testData,
    }),
    queryFn: async () => {
      if (!moderationService || id === undefined) {
        throw new Error('Missing moderation service or report ID')
      }
      if (testData) return getTestReport(id)
      return await client.call(
        tools.ozone.inbox.getReport,
        {id},
        {service: `${moderationService}#atproto_labeler`},
      )
    },
    staleTime: STALE.MINUTES.ONE,
    enabled:
      enabled && hasSession && !!did && !!moderationService && id !== undefined,
  })
}

export function useModerationInboxActionedSubjectsQuery(
  filter: ActionedSubjectsFilter,
) {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did
  const {testData} = useTestInbox()

  return useInfiniteQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'actionedSubjects',
      filter,
      testData,
    }),
    queryFn: async ({pageParam}) =>
      testData && did
        ? listTestSubjects({did, filter, cursor: pageParam, limit: 15})
        : await client.call(
            tools.ozone.inbox.listActionedSubjects,
            {filter, limit: 30, cursor: pageParam},
            {service: MOD_PROXY_SERVICE},
          ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.cursor,
    staleTime: STALE.MINUTES.ONE,
    enabled: hasSession && !!did,
  })
}

export function useModerationInboxAccountStatusQuery() {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did
  const {testData, standing} = useTestInbox()

  return useQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'accountStatus',
      testData,
      standing,
    }),
    queryFn: async () =>
      testData
        ? getTestAccountStatus(standing)
        : await client.call(
            tools.ozone.inbox.getAccountStatus,
            {},
            {service: MOD_PROXY_SERVICE},
          ),
    staleTime: STALE.MINUTES.ONE,
    enabled: hasSession && !!did,
  })
}

export function useModerationInboxSubjectQuery({
  moderationService,
  subject,
  enabled = true,
}: {
  moderationService?: DidString
  subject?: tools.ozone.inbox.getActionedSubject.$Params['subject']
  enabled?: boolean
}) {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did
  const {testData} = useTestInbox()

  return useInfiniteQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'subject',
      moderationService,
      subject,
      testData,
    }),
    queryFn: async ({pageParam}) => {
      if (!moderationService || !subject) {
        throw new Error('Missing moderation service or subject')
      }
      if (testData && did) return getTestSubject({did, subject})
      return await client.call(
        tools.ozone.inbox.getActionedSubject,
        {subject, limit: 50, cursor: pageParam},
        {service: `${moderationService}#atproto_labeler`},
      )
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: page => page.cursor,
    staleTime: STALE.MINUTES.ONE,
    enabled: enabled && hasSession && !!did && !!moderationService && !!subject,
  })
}

export function useAppealModerationInboxSubjectMutation(
  moderationService: DidString,
) {
  const client = useAppviewClient()
  const {currentAccount} = useSession()
  const {testData} = useTestInbox()

  return useMutation({
    mutationFn: async (
      input: tools.ozone.inbox.appealActionedSubject.$InputBody,
    ) =>
      testData && currentAccount
        ? appealTestSubject({did: currentAccount.did, input})
        : await client.call(tools.ozone.inbox.appealActionedSubject, input, {
            service: `${moderationService}#atproto_labeler`,
          }),
    onError: error => {
      if (
        !isNetworkError(error) &&
        !matchXrpcError(error, tools.ozone.inbox.appealActionedSubject)
      ) {
        logger.error('Could not submit moderation inbox appeal', {
          safeMessage: error,
        })
      }
    },
  })
}

/** Refresh after closing the appeal dialog so cache updates cannot dismiss it. */
export function useModerationInboxCacheMutation() {
  const queryClient = useQueryClient()
  const {currentAccount} = useSession()
  const queryKey = createQueryKey(QUERY_KEY_ROOT, {did: currentAccount?.did})

  return async (
    updatedSubject?: tools.ozone.inbox.appealActionedSubject.$OutputBody,
  ) => {
    if (updatedSubject) {
      const subject =
        'did' in updatedSubject.subject &&
        typeof updatedSubject.subject.did === 'string'
          ? updatedSubject.subject.did
          : 'uri' in updatedSubject.subject &&
              typeof updatedSubject.subject.uri === 'string'
            ? updatedSubject.subject.uri
            : undefined
      if (subject) {
        const subjectQueryKey = createQueryKey(QUERY_KEY_ROOT, {
          did: currentAccount?.did,
          endpoint: 'subject',
          moderationService: updatedSubject.src,
          subject,
        })
        await queryClient.cancelQueries({queryKey: subjectQueryKey})
        queryClient.setQueryData<
          InfiniteData<tools.ozone.inbox.getActionedSubject.$OutputBody>
        >(subjectQueryKey, data =>
          data
            ? {
                ...data,
                pages: data.pages.map(page => ({
                  ...page,
                  enforcement: updatedSubject.enforcement,
                  appeal: updatedSubject.appeal,
                  availableActions: updatedSubject.availableActions,
                  isRead: updatedSubject.isRead,
                  updatedAt: updatedSubject.updatedAt,
                })),
              }
            : data,
        )
      }
    }
    await queryClient.invalidateQueries({queryKey})
  }
}

export function useModerationInboxUnreadCountQuery(isEnabled = true) {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did
  const {testData, standing} = useTestInbox()

  return useQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'unreadCount',
      testData,
      standing,
    }),
    queryFn: async () =>
      testData && did
        ? getTestUnreadCount({did, standing})
        : await client.call(
            tools.ozone.inbox.getUnreadCount,
            {},
            {service: MOD_PROXY_SERVICE},
          ),
    staleTime: STALE.SECONDS.THIRTY,
    enabled: isEnabled && hasSession && !!did,
  })
}

export function useModerationInboxNotificationPreferencesQuery(
  isEnabled = true,
) {
  const client = useAppviewClient()
  const {currentAccount, hasSession} = useSession()
  const did = currentAccount?.did

  return useQuery({
    queryKey: createQueryKey(QUERY_KEY_ROOT, {
      did,
      endpoint: 'notificationPreferences',
    }),
    queryFn: async () =>
      await client.call(
        tools.ozone.inbox.getNotificationPreferences,
        {},
        {service: MOD_PROXY_SERVICE},
      ),
    staleTime: STALE.MINUTES.ONE,
    enabled: isEnabled && hasSession && !!did,
  })
}

export function useUpdateModerationInboxNotificationPreferencesMutation() {
  const {t: l} = useLingui()
  const client = useAppviewClient()
  const queryClient = useQueryClient()
  const {currentAccount} = useSession()
  const queryKey = createQueryKey(QUERY_KEY_ROOT, {
    did: currentAccount?.did,
    endpoint: 'notificationPreferences',
  })

  return useMutation({
    mutationFn: async (
      preferences: tools.ozone.inbox.putNotificationPreferences.$InputBody,
    ) =>
      await client.call(
        tools.ozone.inbox.putNotificationPreferences,
        preferences,
        {service: MOD_PROXY_SERVICE},
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey})
    },
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data)
    },
    onError: error => {
      if (!isNetworkError(error)) {
        logger.error(
          'Could not update moderation inbox notification settings',
          {
            safeMessage: error,
          },
        )
      }
      Toast.show(l`Could not update notification settings`, {type: 'error'})
    },
  })
}

export function useUpdateModerationInboxSeenMutation({
  silent = false,
}: {
  silent?: boolean
} = {}) {
  const {t: l} = useLingui()
  const client = useAppviewClient()
  const queryClient = useQueryClient()
  const {currentAccount} = useSession()
  const queryKey = createQueryKey(QUERY_KEY_ROOT, {did: currentAccount?.did})

  const {testData} = useTestInbox()

  return useMutation({
    mutationFn: async (input: tools.ozone.inbox.updateSeen.$InputBody) =>
      testData && currentAccount
        ? markTestSeen({did: currentAccount.did, sections: input.sections})
        : await client.call(tools.ozone.inbox.updateSeen, input, {
            service: MOD_PROXY_SERVICE,
          }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey})
    },
    onError: () => {
      if (silent) return
      Toast.show(l`Failed to mark as read. Please try again.`, {
        type: 'error',
      })
    },
  })
}
