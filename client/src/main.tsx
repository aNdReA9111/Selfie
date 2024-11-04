import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css';

import App from './App.tsx'


import { AuthContextProvider } from './context/authContext'
import { TimeMachineContextProvider } from './context/timeMachineContext.tsx'
import { NotesContextProvider } from './context/NotesContext.tsx'
import { EventsContextProvider } from './context/EventsContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <TimeMachineContextProvider>
        <EventsContextProvider>
          <NotesContextProvider>
            <App />
          </NotesContextProvider>
        </EventsContextProvider>
      </TimeMachineContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
