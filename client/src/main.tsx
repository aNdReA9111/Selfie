import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'


import { AuthContextProvider } from './context/authContext'
import { TimeMachineContextProvider } from './context/timeMachineContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <TimeMachineContextProvider>
        <App />
      </TimeMachineContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
 
