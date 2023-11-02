import React, { createContext, useContext, ReactNode, useState } from 'react';

const SettingContext = createContext<boolean>(false);

export const SettingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popSettings, setPopSettings] = useState<boolean>(false);

  return (
    <SettingContext.Provider value={[ popSettings, setPopSettings ]}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error('useProfile must be used within a SettingsProvider');
  }
  return context;
};
