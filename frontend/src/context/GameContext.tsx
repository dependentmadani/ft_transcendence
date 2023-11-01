import axios from 'axios';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// Define the possible profile states.
// interface ProfileContextType {
//   profileState: ProfileState;
//   setProfileState: (newState: ProfileState) => void;
// }

interface Game {
    playerID1: number,
    playerID2: number,
    mode: string
}


const GameContext = createContext<Game | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [_game, setGame] = useState<Game>({ playerID1: 0, playerID2: 0, mode: 'null' });


  return (
    <GameContext.Provider value={[ _game, setGame ]}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
