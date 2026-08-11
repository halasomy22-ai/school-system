import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // تم إزالة سطر استيراد index.css المتسبب في الخطأ

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
