import { getDatabase } from 'firebase-admin/database';
import { onCall } from 'firebase-functions/https';
import { databasePaths, region, UserNameValidator } from '../../shared';
import { getInvalidArgumentError, getUnauthenticatedError } from '../../hidden';

export const updateUserName = onCall<{ name?: unknown }>(
  { region },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw getUnauthenticatedError();
    }

    const name = request.data?.name;
    if (typeof name !== 'string' || !UserNameValidator.validate(name).isValid) {
      throw getInvalidArgumentError('ユーザー名');
    }

    await getDatabase().ref(databasePaths.users.userName(uid)).set(name);
    return { userName: name };
  },
);
