import React from 'react'
import { BrowserRouter  } from "react-router-dom"
import ReactDOM from 'react-dom/client'
// import Head from './components/Head'
import App from './components/App.tsx'
import  { ClientProvider } from './client/clientContext.tsx'
// import { AuthProvider } from './client/authContext.tsx'

// ReactDOM.createRoot(document.getElementById('myhead')!).render (
//   <Head />
// )

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClientProvider>
        {/* <AuthProvider > */}
          <App />
        {/* </AuthProvider > */}
      </ClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
