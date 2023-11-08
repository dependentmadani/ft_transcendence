import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

type RightBarChatContextType = [boolean, Dispatch<SetStateAction<boolean>>];

const RightBarChatContext = createContext<RightBarChatContextType | undefined>(undefined);

export const RightBarChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rightBarChat, setRightBarChat] = useState<boolean>(false);

  return (
    <RightBarChatContext.Provider value={[rightBarChat, setRightBarChat]}>
      {children}
    </RightBarChatContext.Provider>
  );
};

export const useRightBarChat = (): RightBarChatContextType => {
  const context = useContext(RightBarChatContext);
  if (!context) {
    throw new Error('useRightBarChat must be used within a RightBarChatProvider');
  }
  return context;
};
