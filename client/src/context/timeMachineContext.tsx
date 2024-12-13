import React, { createContext, useReducer } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { TimeMachineAction, TimeMachineContextType, TimeMachineState } from "../utils/types";

export const TimeMachineContext = createContext<TimeMachineContextType | undefined>(undefined);

const timeMachineReducer = (state: TimeMachineState, action: TimeMachineAction): TimeMachineState => {
    switch (action.type) {
        case "SET_OFFSET":
            return {
                offset: action.payload
            }
        case "RESET_OFFSET":
            return {
                offset: 0
            }
        default:
            return state;
    }
};

export const TimeMachineContextProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useAuthContext();
    const [state, dispatch] = useReducer(timeMachineReducer, {
        offset: user ? user.offset : 0
    });

    return (
        <TimeMachineContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TimeMachineContext.Provider>
    );

} 
