import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

// Definiamo un'interfaccia per il tipo di ritorno
interface UseSignupReturn {
    signup: (data: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        birthDate: string;
        desktopNotifications: boolean;
        browserNotifications: boolean;
        emailNotifications: boolean;
    }) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  }
  
  export const useSignup = (): UseSignupReturn => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useAuthContext();


    const signup = async ({ username, email, firstName, lastName, password, birthDate, desktopNotifications, browserNotifications, emailNotifications }: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        birthDate: string;
        desktopNotifications: boolean;
        browserNotifications: boolean;
        emailNotifications: boolean;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:4000/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    nome: firstName,
                    cognome: lastName,
                    password,
                    data_nascita: birthDate,
                    flags: {
                        notifica_email: emailNotifications,
                        notifica_desktop: desktopNotifications,
                        notifica_alert: browserNotifications
                    }
                })
            });

            // Controllo se la risposta è ok prima di fare il parsing
            if (!response.ok) {
                const errorResponse = await response.json(); // Ottieni il testo invece del JSON
                setIsLoading(false);
                setError(errorResponse.message);
                return;
            }
    
            const json = await response.json();
    
            // Salvo lo user nel local storage e dispatch
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('Qualcosa è andato storto, riprova più tardi.');
        }
    }

    return { signup, isLoading, error };

}



