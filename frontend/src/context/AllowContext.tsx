import { createContext, useContext, useState } from 'react';

// Create a context with an initial value of false
const AllowContext = createContext<boolean>(false);

export const AllowProvider = ({ children }) => {
  const [contextAllow, setContextAllow] = useState<boolean>(false);

  // You can add any other functions related to inRoom state here

    const updateAllow = (data:boolean) => {
        setContextAllow(data)
    }

  return (
    <AllowContext.Provider value={[contextAllow, updateAllow]}>
      {children}
    </AllowContext.Provider>
  );
};

export const useAllow = (): any => {
  const context = useContext(AllowContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
