import { createContext, useContext } from 'react';

export type UserContextValue = {
  userName: string | null;
  loadUserName: () => Promise<string | null>;
  saveUserName: (name: string) => Promise<void>;
};

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUserはUserProviderの内側で使用してください');
  }

  return context;
}
