import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Client from '@/components/ClientClass/client';
import { AES, enc } from 'crypto-js';

const CLIENT_STORAGE_KEY = import.meta.env.VITE_CLIENT_STORAGE_KEY;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Define the type for your context value
type ClientContextType = {
  client: Client;
  updateClient: (data: Client) => void;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client>(() => {
    const encryptedData = localStorage.getItem(CLIENT_STORAGE_KEY);

    try {
      if (encryptedData) {
        const decryptedData = AES.decrypt(encryptedData, ENCRYPTION_KEY);
        const parsedData = JSON.parse(decryptedData.toString(enc.Utf8));
        return parsedData || new Client();
      } else {
        return new Client();
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      return new Client();
    }
  });

  useEffect(() => {
    // Encrypt the data before storing it in localStorage
    const encryptedData = AES.encrypt(JSON.stringify(client), ENCRYPTION_KEY).toString();
    localStorage.setItem(CLIENT_STORAGE_KEY, encryptedData);
  }, [client]);

  const updateClient = (data: Client) => {
    setClient(data);
  };

  return (
    <ClientContext.Provider value={{ client, updateClient }}>
      {children}
    </ClientContext.Provider>
  );
};
