import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// One-time cleanup: course content used to be cached in localStorage and could
// go stale after admin edits; the app now always fetches fresh from the backend.
window.localStorage.removeItem('plc-course-content')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
