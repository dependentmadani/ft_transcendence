import React, { createContext, useContext, ReactNode, useState } from 'react';

const RightBarContext = createContext<boolean>(false);

export const RightBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rightBar, setRightBar] = useState<boolean>(false);

  return (
    <RightBarContext.Provider value={[ rightBar, setRightBar ]}>
      {children}
    </RightBarContext.Provider>
  );
};

export const useRightBar = () => {
  const context = useContext(RightBarContext);
  if (!context) {
    throw new Error('useRightBar must be used within a RightBarProvider');
  }
  return context;
};
