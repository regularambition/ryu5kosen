import { databaseColumns } from './columns';

export const databasePaths = {
  users: {
    rootOfTable: () => `${databaseColumns.users.nameOfTable}`,
    userName: (uid: string) =>
      `${databasePaths.users.rootOfTable()}/${uid}/${databaseColumns.users.userName}`,
  },
};
