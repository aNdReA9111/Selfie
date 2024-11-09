import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

// Definiamo un'interfaccia per il tipo di ritorno
interface UseLoginReturn {
    login: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  }
  
export const useLogin = (): UseLoginReturn => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useAuthContext();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error || 'Errore durante il login');
                return;
            }
            // Salvo lo user nel local storage e dispatch
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);

        } catch (error: any) {
            setIsLoading(false);
            setError('Errore di connessione al server');
        }
    }

    return { login, isLoading, error };

}



