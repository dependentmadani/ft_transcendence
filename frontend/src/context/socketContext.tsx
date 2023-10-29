import axios from 'axios';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// Define the possible profile states.
// interface ProfileContextType {
//   profileState: ProfileState;
//   setProfileState: (newState: ProfileState) => void;
// }

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socketa, setSocketa] = useState<Socket>();


  useEffect(() => {

    const _socket: any = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/notification`);
    setSocketa(_socket)
    
    return () => {
      socketa?.disconnect()
    }
  }, []);

  useEffect(() => {

    const getMain = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
      socketa?.emit('someEvent', res.data?.id);
    }
    getMain()

    return () => {
      socketa?.off('someEvent');
    }
  }, [socketa]);

  return (
    <SocketContext.Provider value={{ socketa, setSocketa }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};