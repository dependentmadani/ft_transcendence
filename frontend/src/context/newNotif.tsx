import React, { createContext, useContext, ReactNode, useState } from 'react';

const NewNotifContext = createContext<boolean>(false);

export const NewNotifProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newNotif, setNewNotif] = useState<boolean>(false);

  return (
    <NewNotifContext.Provider value={[ newNotif, setNewNotif ]}>
      {children}
    </NewNotifContext.Provider>
  );
};

export const useNotif = () => {
  const context = useContext(NewNotifContext);
  if (!context) {
    throw new Error('useNewNotif must be used within a NewNotifsProvider');
  }
  return context;
};
