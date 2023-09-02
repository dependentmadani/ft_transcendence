import React from 'react'
import ReactDOM from 'react-dom/client'
import Head from './components/Head'
import App from './App.tsx'
import './index.css'

// ReactDOM.createRoot(document.getElementById('myhead')!).render (
//   <Head />
// )

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
