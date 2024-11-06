import { useEffect, useState } from 'react';
import { useNotesContext } from './useNotesContext';
import { Note } from '../utils/types';

export const useNotes = (url: string, query = {}, options = {}, dependencies = []) => {
  const { dispatch } = useNotesContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchNotes = async () => {
      try {
        const params = new URLSearchParams(query).toString();
        const res = await fetch(url + params, { method: 'GET', ...options });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result: Note[] = await res.json();
        if (!isCancelled) {
          setIsLoading(false);
          setError(null);
          //le date diventano string in json
          result.forEach((el: Note) => {
            el.created = new Date(el.created);
            el.updated = new Date(el.updated);
          });
          dispatch({ type: 'SET_NOTES', payload: result });
        }
      } catch (err: any) {
        if (!isCancelled) {
          setIsLoading(false);
          setError(err.message);
        }
      }
    };

    fetchNotes();

    // Cleanup function to prevent state update if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [url, ...dependencies, dispatch]);

  return { isLoading, error };
}
