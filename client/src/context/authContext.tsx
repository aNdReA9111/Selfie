import { createContext, useReducer, useEffect  } from "react";

export const AuthContext = createContext<any>(null);

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        case "UPDATE":
            return { 
                user: {
                    ...state.user,
                    nome: action.payload.nome,
                    cognome: action.payload.cognome,
                    data_nascita: action.payload.data_nascita,
                    flags: {
                        ...state.user.flags,
                        ...action.payload.flags
                    }
                }
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }: any) => { 
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    }); 

    useEffect(() => {
        const fetchUser = async () => {
            
            const response = await fetch('/api/users/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const user = await response.json();
                dispatch({ type: 'LOGIN', payload: user });
            }else{
                dispatch({ type: 'LOGOUT' });
            }
            
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
};