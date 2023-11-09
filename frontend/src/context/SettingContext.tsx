import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

// Define the type for your context value
type SettingContextType = [boolean, Dispatch<SetStateAction<boolean>>];

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popSettings, setPopSettings] = useState<boolean>(false);

  return (
    <SettingContext.Provider value={[popSettings, setPopSettings]}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = (): SettingContextType => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context;
};
