import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.tsx';


import { ActivitiesContextProvider } from './context/ActivitiesContext.tsx';
import { AuthContextProvider } from './context/authContext';
import { EventsContextProvider } from './context/EventsContext.tsx';
import { NotesContextProvider } from './context/NotesContext.tsx';
import { TimeMachineContextProvider } from './context/timeMachineContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthContextProvider>
            <TimeMachineContextProvider>
                <EventsContextProvider>
                    <ActivitiesContextProvider>
                        <NotesContextProvider>
                            <App />
                        </NotesContextProvider>
                    </ActivitiesContextProvider>
                </EventsContextProvider>
            </TimeMachineContextProvider>
        </AuthContextProvider>
    </StrictMode>,
)
