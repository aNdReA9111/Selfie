import { useEffect, useState } from 'react';
import { useEventsContext } from './useEventsContext';
import { Event } from '../utils/types';

export const useEvents = (url: string, query = {}, options = {}, dependencies = []) => {
  const { dispatch } = useEventsContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams(query).toString();
        const res = await fetch(url + params, { method: 'GET', ...options });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result: Event[] = await res.json();
        if (!isCancelled) {
          setIsLoading(false);
          setError(null);
          //le date diventano string in json
          result.forEach((el: Event) => {
            //FIX TIMEZONE QUI
            el.date = new Date(el.date);
            el.endDate = new Date(el.endDate);
            el.nextDate = el.nextDate ? new Date(el.nextDate): undefined;
          });
          dispatch({ type: 'SET_EVENTS', payload: result });
        }
      } catch (err: any) {
        if (!isCancelled) {
          setIsLoading(false);
          setError(err.message);
        }
      }
    };

    fetchEvents();

    // Cleanup function to prevent state update if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [url, ...dependencies, dispatch]);

  return { isLoading, error };
}
