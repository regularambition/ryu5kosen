import { useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import { signInAnonymously } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { auth, db, functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

type UserProviderProps = {
  children: ReactNode;
};

const updateUserName = httpsCallable<{ name: string }, { userName: string }>(
  functions,
  'updateUserName',
);

function UserProvider({ children }: UserProviderProps) {
  const [userName, setUserName] = useState<string | null>(null);

  const loadUserName = async (): Promise<string | null> => {
    await auth.authStateReady();
    const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
    const snapshot = await get(ref(db, `users/${user.uid}/userName`));

    if (!snapshot.exists()) {
      setUserName(null);
      return null;
    }

    const name: unknown = snapshot.val();
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('保存済みのユーザー名の形式が正しくありません');
    }

    setUserName(name);
    return name;
  };

  const saveUserName = async (name: string): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('ユーザーが認証されていません');
    }

    const { data } = await updateUserName({ name });
    setUserName(data.userName);
  };

  return (
    <UserContext value={{ userName, loadUserName, saveUserName }}>
      {children}
    </UserContext>
  );
}

export default UserProvider;
