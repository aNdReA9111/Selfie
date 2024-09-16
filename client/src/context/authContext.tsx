import { createContext, useReducer } from "react";

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

    console.log(state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
};