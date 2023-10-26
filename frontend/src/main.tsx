import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ClientProvider } from './context/clientContext'
import '@/app.css'
import { ProfileProvider } from './context/ProfileContext'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClientProvider>
      <ProfileProvider>
        <RouterProvider router={router}/>
      </ProfileProvider>
    </ClientProvider>
  </React.StrictMode>,
)
