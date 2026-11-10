import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { setupCrossTabSync } from './store/sync'
import './index.css'

setupCrossTabSync()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    {/* reducedMotion="user": người dùng bật "giảm chuyển động" → bỏ di chuyển, giữ mờ/hiện */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
