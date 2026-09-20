import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { QabxProvider } from '@/state/QabxContext'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Q-ABX could not find the application root element.')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <QabxProvider>
        <App />
      </QabxProvider>
    </BrowserRouter>
  </StrictMode>,
)
