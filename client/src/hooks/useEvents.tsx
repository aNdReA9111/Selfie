import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';

export interface IEvent {
    _id: string;
    titolo: string;
    descrizione: string;
    data: Date;
    frequenza: string[];
    ripetizioni: number;
    _id_utente: string;
}

interface useEventsReturn {
    events: IEvent[];
    setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
    errorEv: string | null;
    getEvents: () => Promise<void>;
}

export const useEvents = (): useEventsReturn => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [errorEv, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    const getEvents = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/events/get/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) 
                throw new Error('Failed to fetch events');
            
            const data : IEvent[] = await response.json();
            setEvents(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    useEffect(() => {
        if (user) {
            getEvents();
        }
    }, [user]);

    return { events, setEvents, errorEv, getEvents };
};
