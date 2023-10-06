// import React, { createContext, useContext, useState } from 'react';
// import Client from './client'; // Import your Client class

// const ClientContext = createContext();

// export const useClient = () => {
//   const client = useContext(ClientContext);

//   if (client === undefined)
//     throw new Error('useClient must be used');
  
//   return client;
// };

// export const ClientProvider = ({ children }) => {
//   const [client, setClient] = useState<Client>(() => new Client());

//   const updateClient = (data) => {
//     setClient(data); // Use the 'data' parameter to update the 'client'
//   };

//   return (
//     <ClientContext.Provider value={{ client, updateClient }}>
//       {children}
//     </ClientContext.Provider>
//   );
// };

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import Client from './client'; // Import your Client class

// const CLIENT_STORAGE_KEY = 'client_data'; // Key for localStorage

// const ClientContext = createContext();

// export const useClient = () => {
//   const client = useContext(ClientContext);

//   if (client === undefined)
//     throw new Error('useClient must be used');
  
//   return client;
// };

// export const ClientProvider = ({ children }) => {
//   const [client, setClient] = useState<Client>(() => {
//     // Try to retrieve the client data from localStorage
//     const storedClientData = localStorage.getItem('CLIENT_DATA');
//     return storedClientData ? JSON.parse(storedClientData) : new Client();
//   });

//   // Update localStorage whenever the client data changes
//   useEffect(() => {
//     localStorage.setItem('CLIENT_DATA', JSON.stringify(client));
//   }, [client]);

//   const updateClient = (data) => {
//     setClient(data); // Use the 'data' parameter to update the 'client'
//   };

//   return (
//     <ClientContext.Provider value={{ client, updateClient }}>
//       {children}
//     </ClientContext.Provider>
//   );
// };



import React, { createContext, useContext, useState, useEffect } from 'react';
import Client from './client';
import { AES, enc } from "crypto-js";


const CLIENT_STORAGE_KEY = 'client_data'; // Key for localStorage
const ENCRYPTION_KEY = 'hlwa'
const ClientContext = createContext<Client | undefined>(undefined);

export const useClient = () => {
  const client = useContext(ClientContext);

  if (client === undefined)
    throw new Error('useClient must be used');
  
  return client;
};

export const ClientProvider = ({ children }) => {
  const [client, setClient] = useState<Client>(() => {
    // Try to retrieve the encrypted client data from localStorage
    const encryptedData = localStorage.getItem(CLIENT_STORAGE_KEY);

    try {
      const decryptedData = AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const parsedData = JSON.parse(decryptedData.toString(enc.Utf8));
      return parsedData || new Client();
    } catch (error) {
      console.error('Error decrypting data:', error);
      // Handle the error gracefully, e.g., by returning a default value or re-encrypting the data
      return new Client();
    }
  });

  // Update localStorage whenever the client data changes
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

