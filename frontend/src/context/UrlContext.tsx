import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

type UrlContextType = [boolean, Dispatch<SetStateAction<boolean>>];
const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myUrl, setMyUrl] = useState<boolean>(false);

  return (
    <UrlContext.Provider value={[myUrl, setMyUrl]}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = (): UrlContextType => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error('useUrl must be used within a UrlProvider');
  }
  return context;
};
