import axios from 'axios';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{ socketa: Socket | undefined; setSocketa: React.Dispatch<React.SetStateAction<Socket | undefined>> } | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socketa, setSocketa] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    try {
      const _socket = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/notification`);
      setSocketa(_socket);
    } catch {
      console.log('wa hamid');
    }

    return () => {
      socketa?.disconnect();
    };
  }, []);

  useEffect(() => {
    const getMain = async () => {
      try {
        const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true });
        if (res.data) {
          socketa?.emit('someEvent', res.data?.id);
        }
      }
      catch (err) {
        console.log('error: ', err);
      }
    };
    try {
    getMain();
    }
    catch (err) {
      console.log('error: ', err)
    }

    return () => {
      socketa?.off('someEvent');
    };
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
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
