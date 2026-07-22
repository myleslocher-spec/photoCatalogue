import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'                               //imports global stylesheet                   
import App from './App.tsx'                        //imports main react component
import { BrowserRouter } from "react-router"       //imports reacts browser routing

createRoot(document.getElementById('root')!).render(    //connects to 'root' in index.html to start webpage, ! prevents createRoot from accepting null
  <StrictMode>
    <BrowserRouter> 
        <App />                                     
    </BrowserRouter>   
  </StrictMode>,
)                                                       //displays imported app.tsx, App contains actual pages/user inteface
