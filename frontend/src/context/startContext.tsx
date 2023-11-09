import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

type StartContextType = [boolean, Dispatch<SetStateAction<boolean>>];
const StartContext = createContext<StartContextType | undefined>(undefined);

export const StartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [start, setStart] = useState<boolean>(false);

  return (
    <StartContext.Provider value={[start, setStart]}>
      {children}
    </StartContext.Provider>
  );
};

export const useStart = (): StartContextType => {
  const context = useContext(StartContext);
  if (!context) {
    throw new Error('useStart must be used within a StartProvider');
  }
  return context;
};
