import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './contextApi/CartContext.tsx'
import { AuthProvider } from './contextApi/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <AuthProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
