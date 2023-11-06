import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ClientProvider } from './context/clientContext'
import '@/app.css'
import { ProfileProvider } from './context/ProfileContext'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GameProvider } from './context/GameContext'
import { SettingProvider } from './context/SettingContext'
import { SocketProvider } from './context/socketContext'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClientProvider>
      <ProfileProvider>
        <GameProvider>
          <SettingProvider>
            <SocketProvider>
              <RouterProvider router={router}/>
              <ToastContainer />
            </SocketProvider>
          </SettingProvider>
        </GameProvider>
      </ProfileProvider>
    </ClientProvider>
  </React.StrictMode>,
)
