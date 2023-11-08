import React, { createContext, useContext, ReactNode, useState } from 'react';

const StartContext = createContext<boolean>(false);

export const StartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [start, setStart] = useState<boolean>(false);

  return (
    <StartContext.Provider value={[ start, setStart ]}>
      {children}
    </StartContext.Provider>
  );
};

export const useStart = () => {
  const context = useContext(StartContext);
  if (!context) {
    throw new Error('useStart must be used within a StartProvider');
  }
  return context;
};
