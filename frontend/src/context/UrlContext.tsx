import React, { createContext, useContext, ReactNode, useState } from 'react';

const UrlContext = createContext<boolean>(false);

export const UrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myUrl, setMyUrl] = useState<boolean>(false);

  return (
    <UrlContext.Provider value={[ myUrl, setMyUrl ]}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error('useUrl must be used within a UrlProvider');
  }
  return context;
};
