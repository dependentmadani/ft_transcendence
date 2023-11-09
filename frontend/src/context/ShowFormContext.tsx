import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

type ShowContextType = [string, Dispatch<SetStateAction<string>>];
const ShowContext = createContext<ShowContextType>(['l3washr', () => {}]);

export const ShowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [show, setShow] = useState<string>('l3washr');

  return (
    <ShowContext.Provider value={[show, setShow]}>
      {children}
    </ShowContext.Provider>
  );
};

export const useShow = (): ShowContextType => {
  const context = useContext(ShowContext);
  if (!context) {
    throw new Error('useShow must be used within a ShowProvider');
  }
  return context;
};
