import React, { createContext, useContext, ReactNode, useState } from 'react';

const ShowContext = createContext<string>('l3washr');

export const ShowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [show, setShow] = useState<string>('l3washr');

  return (
    <ShowContext.Provider value={[ show, setShow ]}>
      {children}
    </ShowContext.Provider>
  );
};

export const useShow = () => {
  const context = useContext(ShowContext);
  if (!context) {
    throw new Error('useProfile must be used within a ShowFoomProvider');
  }
  return context;
};
