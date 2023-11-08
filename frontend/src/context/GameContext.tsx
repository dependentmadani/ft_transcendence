import React, { createContext, useContext, ReactNode, useState } from 'react';

interface Game {
  playerID1: number;
  playerID2: number;
  mode: string;
}

interface GameContextType {
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game>({ playerID1: 0, playerID2: 0, mode: 'null' });

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
