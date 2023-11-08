import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

type RightBarContextType = [boolean, Dispatch<SetStateAction<boolean>>];

const RightBarContext = createContext<RightBarContextType | undefined>(undefined);

export const RightBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rightBar, setRightBar] = useState<boolean>(false);

  return (
    <RightBarContext.Provider value={[rightBar, setRightBar]}>
      {children}
    </RightBarContext.Provider>
  );
};

export const useRightBar = (): RightBarContextType => {
  const context = useContext(RightBarContext);
  if (!context) {
    throw new Error('useRightBar must be used within a RightBarProvider');
  }
  return context;
};
