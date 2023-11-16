import React, { createContext, useContext, ReactNode } from 'react';

interface UserIdContextProps {
  children: ReactNode;
}

interface UserIdContextValue {
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
}

const UserIdContext = createContext<UserIdContextValue | undefined>(undefined);

export const UserIdProvider: React.FC<UserIdContextProps> = ({ children }) => {
  const [userId, setUserId] = React.useState<number>(0);

  const contextValue: UserIdContextValue = {
    userId,
    setUserId,
  };

  return <UserIdContext.Provider value={contextValue}>{children}</UserIdContext.Provider>;
};

export const useUserId = (): UserIdContextValue => {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
};