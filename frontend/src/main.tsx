import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ClientProvider } from './context/clientContext'
import '@/app.css'
import { ProfileProvider } from './context/ProfileContext'
import { SocketProvider } from '@/context/socketContext';
import { GameProvider } from './context/GameContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClientProvider>
      <SocketProvider>
        <GameProvider>
          <ProfileProvider>
            <RouterProvider router={router}/>
          </ProfileProvider>
        </GameProvider>
      </SocketProvider>
    </ClientProvider>
  </React.StrictMode>,
)
