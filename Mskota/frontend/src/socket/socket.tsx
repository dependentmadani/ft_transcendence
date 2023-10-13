import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const serverUrl = import.meta.env.VITE_BACK_ADDRESS; // Replace with your NestJS server URL

export function useSocket(namespace) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl + namespace);

    newSocket.on('connect', () => {
      console.log(`Connected to WebSocket server in ${namespace}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [namespace]);

  return socket;
}
