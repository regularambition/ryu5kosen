import { getDatabase } from 'firebase-admin/database';
import { onCall } from 'firebase-functions/https';
import { databasePaths, region, UserNameValidator } from '../../shared';
import type {
  UpdateUserNameRequest,
  UpdateUserNameResponse,
} from '../../shared';
import { getInvalidArgumentError, getUnauthenticatedError } from '../../hidden';

export const updateUserName = onCall<UpdateUserNameRequest>(
  { region },
  async (request): Promise<UpdateUserNameResponse> => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw getUnauthenticatedError();
    }

    const nameInput = request.data?.nameInput;
    if (
      typeof nameInput !== 'string' ||
      !UserNameValidator.validate(nameInput).isValid
    ) {
      throw getInvalidArgumentError('ユーザー名');
    }

    await getDatabase().ref(databasePaths.users.userName(uid)).set(nameInput);
    return { userName: nameInput };
  },
);
