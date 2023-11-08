import React, { createContext, useContext, useState, useEffect } from 'react';
import Client from '@/components/ClientClass/client';
import { AES, enc } from 'crypto-js';

const CLIENT_STORAGE_KEY = import.meta.env.VITE_CLIENT_STORAGE_KEY;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const ClientContext = createContext<Client | undefined>(undefined);

export const useClient = () => {
  const client = useContext(ClientContext);

  if (client === undefined) throw new Error('useClient must be used');

  return client;
};

export const ClientProvider = ({ children }) => {
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

  const updateClient = (data) => {
    setClient(data);
  };

  return (
    <ClientContext.Provider value={{ client, updateClient }}>
      {children}
    </ClientContext.Provider>
  );
};
