import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.DEV ? "/absproxy/8081" : "/"}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)


// /basename="/absproxy/8081"