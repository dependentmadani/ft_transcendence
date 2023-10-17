import React from 'react'
import ReactDOM from 'react-dom/client'
// import './Chat/style.scss'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ClientProvider } from './context/clientContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClientProvider>
      <RouterProvider router={router}/>
    </ClientProvider>
  </React.StrictMode>,
)
