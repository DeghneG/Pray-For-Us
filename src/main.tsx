import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BagProvider } from './lib/bag'
import { MotionProvider } from './lib/motion'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionProvider>
        <BagProvider>
          <App />
        </BagProvider>
      </MotionProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
