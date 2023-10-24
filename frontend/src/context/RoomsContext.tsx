import React, { createContext, useContext, useState } from 'react';

// Create a context with an initial value of false
const RoomContext = createContext<boolean>(false);

export const RoomProvider = ({ children }) => {
  const [contextRoom, setContextRoom] = useState<boolean>(false);

  // You can add any other functions related to inRoom state here

    const updateRoom = (data:boolean) => {
        setContextRoom(data)
    }

  return (
    <RoomContext.Provider value={[contextRoom, updateRoom]}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
