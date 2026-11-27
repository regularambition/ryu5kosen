import { HttpsError } from 'firebase-functions/https';

export function getUnauthenticatedError() {
  return new HttpsError('unauthenticated', 'ログインが必要です。');
}

export function getInvalidArgumentError(parameterName: string) {
  return new HttpsError(
    'invalid-argument',
    `${parameterName}が不正な形式で入力されているか、不正な値を持っています。`,
  );
}
