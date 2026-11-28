import { databaseColumns } from './columns';

export const databasePaths = {
  users: {
    rootOfTable: () => `${databaseColumns.users.nameOfTable}`,
    userName: (uid: string) =>
      `${databasePaths.users.rootOfTable()}/${uid}/${databaseColumns.users.userName}`,
  },

  matchMakingRequests: {
    rootOfTable: () => `${databaseColumns.matchMakingRequests.nameOfTable}`,
    rootOfEachUser: (uid: string) =>
      `${databasePaths.matchMakingRequests.rootOfTable()}/${uid}`,
    searchId: (uid: string) =>
      `${databasePaths.matchMakingRequests.rootOfEachUser(uid)}/${databaseColumns.matchMakingRequests.searchId}`,
    status: (uid: string) =>
      `${databasePaths.matchMakingRequests.rootOfEachUser(uid)}/${databaseColumns.matchMakingRequests.status}`,
    expiresAt: (uid: string) =>
      `${databasePaths.matchMakingRequests.rootOfEachUser(uid)}/${databaseColumns.matchMakingRequests.expiresAt}`,
    matchId: (uid: string) =>
      `${databasePaths.matchMakingRequests.rootOfEachUser(uid)}/${databaseColumns.matchMakingRequests.matchId}`,
  },
};
