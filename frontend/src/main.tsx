import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ClientProvider } from './context/clientContext'
import '@/app.css'
import { ProfileProvider } from './context/ProfileContext'
import { SocketProvider } from '@/context/socketContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClientProvider>
      <SocketProvider>
        <ProfileProvider>
          <RouterProvider router={router}/>
        </ProfileProvider>
      </SocketProvider>
    </ClientProvider>
  </React.StrictMode>,
)
