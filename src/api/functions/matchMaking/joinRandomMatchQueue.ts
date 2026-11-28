import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../firebase';
import type {
  JoinRandomMatchQueueRequest,
  MatchMakingRequest,
} from '../../../../functions/src/shared';

/**
 * httpsCallable の型パラメータは
 * <requestType, responseType>
 */
export const joinRandomMatchQueue = httpsCallable<
  JoinRandomMatchQueueRequest,
  MatchMakingRequest
>(functions, 'joinRandomMatchQueue');
