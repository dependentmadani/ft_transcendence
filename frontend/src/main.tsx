import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ClientProvider } from './context/clientContext';
import '@/app.css';
import { ProfileProvider } from './context/ProfileContext';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GameProvider } from './context/GameContext';
import { SettingProvider } from './context/SettingContext';
import { SocketProvider } from './context/socketContext';
import { StartProvider } from './context/startContext';
import { ScoreProvider, UrlProvider, useUrl } from './context/UrlContext';

// const CLIENT_STORAGE_KEY = import.meta.env.VITE_CLIENT_STORAGE_KEY;

const MyComponent = () => {

  
  useEffect(() => {

    function reload() {
      location.reload();
    }

    window.addEventListener('popstate', reload);
    return () => {
      window.addEventListener('popstate', reload);
    };
  }, []);

  return (
    <React.StrictMode>
      <ClientProvider>
        <ProfileProvider>
          <GameProvider>
            <SettingProvider>
              <SocketProvider>

                <StartProvider> 
                  <UrlProvider>
                      <RouterProvider router={router} />
                      <ToastContainer />
                  </UrlProvider>
                </StartProvider>
              
              </SocketProvider>
            </SettingProvider>
          </GameProvider>
        </ProfileProvider>
      </ClientProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<MyComponent />);
