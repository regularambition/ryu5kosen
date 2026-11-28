export const MatchMakingRequestStatus = {
  WAITING: 'waiting',
  MATCHED: 'matched',
  TIMED_OUT: 'timedOut',
  CANCELLED: 'cancelled',
} as const;

export type MatchMakingRequestStatus =
  (typeof MatchMakingRequestStatus)[keyof typeof MatchMakingRequestStatus];

export type MatchMakingRequest = {
  searchId: string;
  expiresAt: number;
} & (
  | { status: typeof MatchMakingRequestStatus.MATCHED; matchId: string }
  | {
      status: Exclude<
        MatchMakingRequestStatus,
        typeof MatchMakingRequestStatus.MATCHED
      >;
    }
);
