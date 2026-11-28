import { getDatabase } from 'firebase-admin/database';
import { HttpsError, onCall } from 'firebase-functions/https';
import { getInvalidArgumentError, getUnauthenticatedError } from '../../hidden';
import {
  databaseColumns,
  MatchMakingRequestStatus as Status,
  region,
} from '../../shared';
import type {
  JoinRandomMatchQueueRequest,
  MatchMakingRequest,
} from '../../shared';
import { logger } from 'firebase-functions';

type Entry = MatchMakingRequest;
type Queue = Record<string, Entry>;

// const SEARCH_DURATION_MS = 60_000;
const SEARCH_DURATION_MS = 10_000;

function queueRef() {
  return getDatabase().ref(databaseColumns.matchMakingRequests.nameOfTable);
}

function requireUid(uid: string | undefined): string {
  if (!uid) throw getUnauthenticatedError();
  return uid;
}

function requireSearchId(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 128) {
    throw getInvalidArgumentError('searchId');
  }
  return value;
}

export function tryMatch(
  queue: Queue,
  uid: string,
  now: number,
  matchId: string,
): void {
  const mine = queue[uid];

  const opponent = Object.entries(queue).find(
    ([otherUid, entry]) =>
      otherUid !== uid &&
      entry.status === Status.WAITING &&
      entry.expiresAt > now,
  );

  if (!opponent) return;

  const [otherUid, other] = opponent;
  queue[uid] = { ...mine, status: Status.MATCHED, matchId };
  queue[otherUid] = { ...other, status: Status.MATCHED, matchId };
}

export const joinRandomMatchQueue = onCall<JoinRandomMatchQueueRequest>(
  { region },
  async (request): Promise<Entry> => {
    const uid = requireUid(request.auth?.uid);
    const searchId = requireSearchId(request.data?.searchId);
    const previousSearchId =
      request.data.previousSearchId === null
        ? null
        : requireSearchId(request.data.previousSearchId);

    const result = await queueRef().transaction((current: Queue | null) => {
      const queue = current ?? {};
      const mine = queue[uid];
      const now = Date.now();

      // 同じ検索の再送。期限を延ばしたり、成立済みの結果を消したりしない。
      if (mine?.searchId === searchId) return current;

      // 別の画面がすでに次の検索を開始した。
      if ((mine?.searchId ?? null) !== previousSearchId) return current;

      // 現在進行中の検索、または成立済みの対戦を保護する。
      if (mine?.status === Status.MATCHED) return current;
      if (mine?.status === Status.WAITING && mine.expiresAt > now)
        return current;

      queue[uid] = {
        searchId,
        status: Status.WAITING,
        expiresAt: now + SEARCH_DURATION_MS,
      };

      return queue;
    });

    const mine = result.snapshot.child(uid).val() as Entry | null;
    if (mine?.searchId !== searchId) {
      throw new HttpsError(
        'failed-precondition',
        '現在の検索状態が変わりました。検索結果を再取得してください。',
      );
    }

    logger.info(`${uid}が対戦相手待機キューに追加されました`);

    return mine;
  },
);

type LeaveInput = {
  searchId: string;
  reason: 'timeout' | 'cancel';
};

export const leaveRandomMatchQueue = onCall<LeaveInput>(
  { region },
  async (request): Promise<Entry | null> => {
    const uid = requireUid(request.auth?.uid);
    const searchId = requireSearchId(request.data?.searchId);
    const reason = request.data.reason;

    if (reason !== 'timeout' && reason !== 'cancel') {
      throw getInvalidArgumentError('reason');
    }

    const result = await queueRef()
      .child(uid)
      .transaction((mine: Entry | null) => {
        // 古いタイマーや戻る操作は、次の検索に影響させない。
        if (!mine || mine.searchId !== searchId) return mine;
        if (mine.status !== Status.WAITING) return mine;

        if (reason === 'cancel') {
          return { ...mine, status: Status.CANCELLED };
        }

        // タイムアウトの判定にはサーバー側の時計を使う。
        if (Date.now() < mine.expiresAt) return mine;
        return { ...mine, status: Status.TIMED_OUT };
      });

    const mine = result.snapshot.val() as Entry | null;
    return mine?.searchId === searchId ? mine : null;
  },
);
