import { getDatabase } from 'firebase-admin/database';
import { getFunctions } from 'firebase-admin/functions';
import { onValueWritten } from 'firebase-functions/v2/database';
import { onTaskDispatched } from 'firebase-functions/v2/tasks';
import {
  databaseColumns,
  MatchMakingRequestStatus as Status,
  region,
  databasePaths,
} from '../../shared';
import type { MatchMakingRequest } from '../../shared';
import { logger } from 'firebase-functions';

type TimeoutTask = {
  uid: string;
  searchId: string;
  expiresAt: number;
};

const table = databaseColumns.matchMakingRequests.nameOfTable;
const taskName = `locations/${region}/functions/expireMatchMakingRequest`;

export const scheduleMatchMakingTimeout = onValueWritten(
  { ref: `/${table}/{uid}`, region, retry: true },
  async (event) => {
    const before = event.data.before.val() as MatchMakingRequest | null;
    const after = event.data.after.val() as MatchMakingRequest | null;

    if (after?.status !== Status.WAITING) return;

    // 同じ検索が同じ期限で待機し続けている場合、予約はすでにある。
    if (
      before?.status === Status.WAITING &&
      before.searchId === after.searchId &&
      before.expiresAt === after.expiresAt
    ) {
      return;
    }

    const queue = getFunctions().taskQueue<TimeoutTask>(taskName);

    await queue.enqueue(
      {
        uid: event.params.uid,
        searchId: after.searchId,
        expiresAt: after.expiresAt,
      },
      { scheduleTime: new Date(after.expiresAt) },
    );

    logger.info(
      `${event.params.uid}の対戦相手検索タイムアウトが予約されました（${after.expiresAt}）`,
    );
  },
);

export const expireMatchMakingRequest = onTaskDispatched<TimeoutTask>(
  {
    region,
    retryConfig: {
      maxAttempts: 5,
      minBackoffSeconds: 1,
    },
  },
  async ({ data }) => {
    const { uid, searchId, expiresAt } = data;
    const requestRef = getDatabase().ref(
      databasePaths.matchMakingRequests.rootOfEachUser(uid),
    );

    // 時計のずれなどで期限より早ければ、タスクを再試行させる。
    if (Date.now() < expiresAt) {
      throw new Error('検索期限に達していません。');
    }

    await requestRef.transaction((current: MatchMakingRequest | null) => {
      if (
        current === null ||
        current.searchId !== searchId ||
        current.expiresAt !== expiresAt ||
        current.status !== Status.WAITING
      ) {
        return current;
      }

      return { ...current, status: Status.TIMED_OUT };
    });

    logger.info(
      `${uid}の対戦相手検索がタイムアウトとなりました（${expiresAt}）`,
    );
  },
);
