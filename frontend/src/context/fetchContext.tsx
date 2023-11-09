import React, { createContext, useContext, ReactNode, useState } from 'react';

interface FetchContextType {
  fetch: boolean;
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FetchContext = createContext<FetchContextType | undefined>(undefined);

export const FetchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fetch, setFetch] = useState<boolean>(false);

  return (
    <FetchContext.Provider value={{ fetch, setFetch }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetch = () => {
  const context = useContext(FetchContext);
  if (!context) {
    throw new Error('useFetch must be used within a FetchProvider');
  }
  return context;
};
