import React from 'react';
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
import { FetchProvider } from './context/fetchContext';
import { NewNotifProvider } from './context/newNotif';
import { StartProvider } from './context/startContext';
import { UrlProvider } from './context/UrlContext';


const MyComponent = () => {
  

  return (
    <React.StrictMode>
      <ClientProvider>
        <ProfileProvider>
          <GameProvider>
            <SettingProvider>
              <SocketProvider>
                <FetchProvider>
                  <NewNotifProvider>
                    <StartProvider> 
                      <UrlProvider>
                        <RouterProvider router={router} />
                        <ToastContainer pauseOnHover={false} />
                      </UrlProvider>
                    </StartProvider>
                  </NewNotifProvider>
                </FetchProvider>
              </SocketProvider>
            </SettingProvider>
          </GameProvider>
        </ProfileProvider>
      </ClientProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<MyComponent />);
