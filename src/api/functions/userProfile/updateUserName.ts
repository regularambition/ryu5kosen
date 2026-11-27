import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../firebase';
import type {
  UpdateUserNameRequest,
  UpdateUserNameResponse,
} from '../../../../functions/src/shared';

/**
 * httpsCallable の型パラメータは
 * <requestType, responseType>
 */
export const updateUserName = httpsCallable<
  UpdateUserNameRequest,
  UpdateUserNameResponse
>(functions, 'updateUserName');
