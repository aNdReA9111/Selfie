import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext<any>(null);

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }: any) => { 
    const [state, dispatch] = useReducer(authReducer, {
            user: null
        }); 

    useEffect(() =>{
        const user = localStorage.getItem('user');
        if (user !== null) {
            const parsedUser = JSON.parse(user);
            dispatch({type: 'LOGIN', payload: parsedUser});
        }
    }, []);

    console.log(state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
};