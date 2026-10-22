/*
 * Fork: sample data for testing the moderation inbox (Settings > Beta
 * features > Moderation inbox). When the test switch is on, every inbox query
 * in `moderation-inbox.ts` reads from here instead of the moderation service,
 * and writes (mark as read, appeals) only change this in-memory state. Nothing
 * is sent to the server.
 *
 * The data covers every report status and resolution, every public action
 * type, every enforcement state and every appeal state, with enough items to
 * exercise pagination and the unread filters.
 */
import {type DidString} from '@atproto/syntax'

import {type tools} from '#/lexicons'

type ReportsFilter = NonNullable<
  tools.ozone.inbox.listReports.$Params['filter']
>
type SubjectsFilter = NonNullable<
  tools.ozone.inbox.listActionedSubjects.$Params['filter']
>
type ReportsPage = tools.ozone.inbox.listReports.$OutputBody
type Report = ReportsPage['reports'][number]
type SubjectsPage = tools.ozone.inbox.listActionedSubjects.$OutputBody
type Subject = SubjectsPage['subjects'][number]
type SubjectDetail = tools.ozone.inbox.getActionedSubject.$OutputBody
type ReportDetail = tools.ozone.inbox.getReport.$OutputBody
type AccountStatus = tools.ozone.inbox.getAccountStatus.$OutputBody
type UnreadCount = tools.ozone.inbox.getUnreadCount.$OutputBody
type Seen = tools.ozone.inbox.updateSeen.$OutputBody

export type TestAccountStanding = 'good' | 'warning' | 'atRisk'

/** Bluesky's moderation service, so the rows look like real ones. */
export const TEST_MOD_SERVICE = 'did:plc:ar7c4by46qjdydhdevvrndac' as DidString
/** The bsky.app account, so reported-account previews have a real profile. */
const REPORTED_ACCOUNT = 'did:plc:z72i7hdynmk6r22z27h6tvur'
const SAMPLE_CID = 'bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy'

const REPORT_COUNT = 60
const SUBJECT_COUNT = 45
const FIRST_REPORT_ID = 900001
const FIRST_ACTION_ID = 700001
const HOUR = 3_600_000
const DAY = 24 * HOUR

const REPORT_REASONS = [
  'tools.ozone.report.defs#reasonMisleadingSpam',
  'tools.ozone.report.defs#reasonHarassmentTroll',
  'tools.ozone.report.defs#reasonViolenceThreats',
  'tools.ozone.report.defs#reasonMisleadingImpersonation',
  'tools.ozone.report.defs#reasonSexualUnlabeled',
  'tools.ozone.report.defs#reasonHarassmentHateSpeech',
  'tools.ozone.report.defs#reasonMisleadingScam',
  'tools.ozone.report.defs#reasonOther',
]

/** Outcomes for resolved reports; `undefined` is "reviewed, no action". */
const REPORT_ACTIONS = [
  'contentRemoved',
  undefined,
  'labelApplied',
  'accountSuspended',
  'accountTakedown',
  'contentRestored',
  'accountRestored',
  'labelRemoved',
  'communicationSent',
  'reportingRestricted',
  'credentialsRevoked',
] as const

const SUBJECT_ACTIONS = [
  'contentRemoved',
  'labelApplied',
  'accountSuspended',
  'accountTakedown',
  'reportingRestricted',
  'credentialsRevoked',
  'labelRemoved',
  'communicationSent',
  'contentRestored',
  'accountRestored',
] as const

const APPEAL_STATES = [
  'none',
  'pending',
  'approved',
  'denied',
  'expired',
  'superseded',
] as const

const POLICIES = [
  {
    key: 'spam',
    displayName: 'Spam',
    link: 'https://bsky.social/about/support/community-guidelines',
  },
  {
    key: 'harassment',
    displayName: 'Harassment',
    link: 'https://bsky.social/about/support/community-guidelines',
  },
  {
    key: 'ban-evasion',
    displayName: 'Ban evasion',
    link: 'https://bsky.social/about/support/community-guidelines',
  },
]

/** In-memory state, so actions taken while testing stick for the session. */
const state = {
  readReportIds: new Set<number>(),
  readSubjectKeys: new Set<string>(),
  appealedSubjectKeys: new Set<string>(),
  accountStatusSeen: false,
}

function iso(time: number) {
  return new Date(time).toISOString()
}

function pageOf<T>(items: T[], cursor: string | undefined, limit: number) {
  const start = cursor ? Number(cursor) : 0
  const end = start + limit
  return {
    items: items.slice(start, end),
    cursor: end < items.length ? String(end) : undefined,
  }
}

function sampleReports(now: number): Report[] {
  return Array.from({length: REPORT_COUNT}, (_, i) => {
    const id = FIRST_REPORT_ID + i
    const createdAt = now - i * 7 * HOUR
    const isPending = i % 4 === 0
    const action = REPORT_ACTIONS[i % REPORT_ACTIONS.length]
    const isPost = i % 3 !== 0
    const report: Report = {
      src: TEST_MOD_SERVICE,
      id,
      isRead: i >= 12 || state.readReportIds.has(id),
      reasonType: REPORT_REASONS[i % REPORT_REASONS.length],
      ...(i % 5 === 0
        ? {reason: `Sample report #${i + 1}, with a note from the reporter.`}
        : {}),
      subject: isPost
        ? {
            $type: 'com.atproto.repo.strongRef',
            uri: `at://${REPORTED_ACCOUNT}/app.bsky.feed.post/sample${id}`,
            cid: SAMPLE_CID,
          }
        : {$type: 'com.atproto.admin.defs#repoRef', did: REPORTED_ACCOUNT},
      status: isPending ? 'pending' : 'resolved',
      createdAt: iso(createdAt),
      updatedAt: iso(createdAt + (isPending ? 0 : 3 * HOUR)),
      ...(isPending || !action ? {} : {lastActionTaken: action}),
    }
    return report
  })
}

/** A subject's URI or DID, which is how the inbox identifies it. */
function subjectKey(subject: object) {
  return 'uri' in subject && typeof subject.uri === 'string'
    ? subject.uri
    : 'did' in subject && typeof subject.did === 'string'
      ? subject.did
      : ''
}

function sampleSubjects(did: string, now: number): Subject[] {
  return Array.from({length: SUBJECT_COUNT}, (_, i) => {
    const actionType = SUBJECT_ACTIONS[i % SUBJECT_ACTIONS.length]
    const isAccountAction =
      actionType.startsWith('account') ||
      actionType === 'reportingRestricted' ||
      actionType === 'credentialsRevoked'
    const subject: Subject['subject'] = isAccountAction
      ? {$type: 'com.atproto.admin.defs#repoRef', did}
      : {
          $type: 'com.atproto.repo.strongRef',
          uri: `at://${did}/app.bsky.feed.post/sample${i}`,
          cid: SAMPLE_CID,
        }
    const key = subjectKey(subject)
    const createdAt = now - i * 11 * HOUR
    const isReversed =
      actionType === 'contentRestored' ||
      actionType === 'accountRestored' ||
      actionType === 'labelRemoved'
    const isExpiredSuspension = actionType === 'accountSuspended' && i % 2 === 1
    const expiresAt =
      actionType === 'accountSuspended'
        ? iso(isExpiredSuspension ? createdAt + DAY : now + 3 * DAY)
        : undefined

    const enforcementState = isReversed
      ? 'none'
      : actionType === 'contentRemoved'
        ? 'removed'
        : actionType === 'labelApplied'
          ? 'labeled'
          : actionType === 'accountSuspended'
            ? isExpiredSuspension
              ? 'none'
              : 'suspended'
            : actionType === 'accountTakedown'
              ? 'takendown'
              : 'none'

    let appealState = APPEAL_STATES[i % APPEAL_STATES.length]
    if (state.appealedSubjectKeys.has(key)) appealState = 'pending'
    const appeal: Subject['appeal'] =
      appealState === 'none'
        ? {state: 'none', appealableUntil: iso(now + 7 * DAY)}
        : appealState === 'approved' || appealState === 'denied'
          ? {
              state: 'resolved',
              outcome: appealState,
              appealedAt: iso(createdAt + DAY),
              resolvedAt: iso(createdAt + 2 * DAY),
            }
          : {state: appealState, appealedAt: iso(createdAt + DAY)}

    const latestAction: NonNullable<Subject['latestAction']> = {
      id: FIRST_ACTION_ID + i,
      type: actionType,
      scope: isAccountAction ? 'network' : 'app',
      createdAt: iso(createdAt),
      ...(actionType === 'labelApplied' || actionType === 'labelRemoved'
        ? {labels: ['graphic-media']}
        : {}),
      ...(actionType === 'contentRemoved' ||
      actionType === 'accountSuspended' ||
      actionType === 'accountTakedown' ||
      actionType === 'credentialsRevoked'
        ? {policies: [POLICIES[i % POLICIES.length]]}
        : {}),
      ...(expiresAt ? {expiresAt} : {}),
    }

    return {
      src: TEST_MOD_SERVICE,
      subject,
      enforcement: {
        state: enforcementState,
        scope: isAccountAction ? 'network' : 'app',
        ...(enforcementState === 'labeled' ? {labels: ['graphic-media']} : {}),
        ...(enforcementState === 'suspended' && expiresAt ? {expiresAt} : {}),
      },
      isRead: i >= 9 || state.readSubjectKeys.has(key),
      createdAt: iso(createdAt),
      updatedAt: iso(createdAt + HOUR),
      actionCount: 1 + (i % 3),
      latestAction,
      appeal,
      availableActions:
        appealState === 'none' && enforcementState !== 'none' ? ['appeal'] : [],
    }
  })
}

function filterReports(reports: Report[], filter: ReportsFilter) {
  switch (filter) {
    case 'pending':
      return reports.filter(report => report.status === 'pending')
    case 'resolved':
      return reports.filter(report => report.status === 'resolved')
    case 'unread':
      return reports.filter(report => !report.isRead)
    default:
      return reports
  }
}

function filterSubjects(subjects: Subject[], filter: SubjectsFilter) {
  switch (filter) {
    case 'pending':
      return subjects.filter(subject => subject.appeal?.state === 'pending')
    case 'resolved':
      return subjects.filter(subject => subject.appeal?.state === 'resolved')
    case 'unread':
      return subjects.filter(subject => !subject.isRead)
    default:
      return subjects
  }
}

export function listTestReports({
  filter,
  cursor,
  limit,
}: {
  filter: ReportsFilter
  cursor?: string
  limit: number
}): ReportsPage {
  const reports = filterReports(sampleReports(Date.now()), filter)
  const page = pageOf(reports, cursor, limit)
  return {reports: page.items, cursor: page.cursor}
}

export function getTestReport(id: number): ReportDetail {
  const report = sampleReports(Date.now()).find(r => r.id === id)
  if (!report) throw new Error('Sample report not found')
  const {isRead: _isRead, lastActionTaken, ...rest} = report
  const isPost = 'uri' in report.subject
  return {
    report: {
      ...rest,
      ...(isPost
        ? {
            record: {
              $type: 'app.bsky.feed.post',
              text: `This is sample post content for report #${id - FIRST_REPORT_ID + 1}.`,
              createdAt: report.createdAt,
            },
          }
        : {}),
    },
    ...(report.status === 'resolved'
      ? {
          resolution: {
            outcome: lastActionTaken ? 'actionTaken' : 'noAction',
            resolvedAt: report.updatedAt,
            ...(lastActionTaken ? {actionTaken: lastActionTaken} : {}),
          },
        }
      : {}),
  }
}

export function listTestSubjects({
  did,
  filter,
  cursor,
  limit,
}: {
  did: string
  filter: SubjectsFilter
  cursor?: string
  limit: number
}): SubjectsPage {
  const subjects = filterSubjects(sampleSubjects(did, Date.now()), filter)
  const page = pageOf(subjects, cursor, limit)
  return {subjects: page.items, cursor: page.cursor}
}

export function getTestSubject({
  did,
  subject,
}: {
  did: string
  subject: string
}): SubjectDetail {
  const found = sampleSubjects(did, Date.now()).find(
    s => subjectKey(s.subject) === subject,
  )
  if (!found) throw new Error('Sample subject not found')
  const {latestAction, actionCount: _actionCount, ...rest} = found
  const createdAt = Date.parse(found.createdAt)
  const isPost = 'uri' in found.subject
  return {
    ...rest,
    // Most recent first: the latest action, then an older warning
    actions: [
      ...(latestAction ? [latestAction] : []),
      {
        id: (latestAction?.id ?? FIRST_ACTION_ID) + 100000,
        type: 'communicationSent',
        createdAt: iso(createdAt - 2 * DAY),
      },
    ],
    reports: {
      reasonTypes: [REPORT_REASONS[0], REPORT_REASONS[1]],
      firstReportedOn: iso(createdAt - 3 * DAY),
      lastReportedOn: iso(createdAt - DAY),
    },
    ...(isPost
      ? {
          record: {
            $type: 'app.bsky.feed.post',
            text: 'This is sample post content that was actioned.',
            createdAt: iso(createdAt - 3 * DAY),
          },
        }
      : {}),
  }
}

export function getTestAccountStatus(
  standing: TestAccountStanding,
): AccountStatus {
  return {
    src: TEST_MOD_SERVICE,
    standing,
    updatedAt: iso(Date.now() - DAY),
  }
}

export function getTestUnreadCount({
  did,
  standing,
}: {
  did: string
  standing: TestAccountStanding
}): UnreadCount {
  const now = Date.now()
  const reports = sampleReports(now).filter(r => !r.isRead).length
  const subjects = sampleSubjects(did, now).filter(s => !s.isRead).length
  const accountStatus = standing !== 'good' && !state.accountStatusSeen ? 1 : 0
  return {
    unreadCounts: {
      total: reports + subjects + accountStatus,
      reports,
      subjects,
      accountStatus,
    },
  }
}

export function markTestSeen({
  did,
  sections,
}: {
  did: string
  sections: tools.ozone.inbox.updateSeen.$InputBody['sections']
}): Seen {
  const now = Date.now()
  if (sections.includes('reports')) {
    for (const report of sampleReports(now)) state.readReportIds.add(report.id)
  }
  if (sections.includes('subjects')) {
    for (const subject of sampleSubjects(did, now)) {
      state.readSubjectKeys.add(subjectKey(subject.subject))
    }
  }
  if (sections.includes('accountStatus')) state.accountStatusSeen = true
  return {seenAt: iso(now)}
}

export function appealTestSubject({
  did,
  input,
}: {
  did: string
  input: tools.ozone.inbox.appealActionedSubject.$InputBody
}): tools.ozone.inbox.appealActionedSubject.$OutputBody {
  const key = subjectKey(input.subject)
  state.appealedSubjectKeys.add(key)
  const updated = sampleSubjects(did, Date.now()).find(
    s => subjectKey(s.subject) === key,
  )
  if (!updated) throw new Error('Sample subject not found')
  return updated
}

/** Puts every sample item back to its starting read/appeal state. */
export function resetTestModerationInbox() {
  state.readReportIds.clear()
  state.readSubjectKeys.clear()
  state.appealedSubjectKeys.clear()
  state.accountStatusSeen = false
}
