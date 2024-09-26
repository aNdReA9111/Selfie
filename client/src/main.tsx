import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'


import { AuthContextProvider } from './context/authContext'
import { TimeMachineContextProvider } from './context/timeMachineContext.tsx'
import { NotesContextProvider } from './context/NotesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <TimeMachineContextProvider>
        <NotesContextProvider>
          <App />
        </NotesContextProvider>
      </TimeMachineContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
