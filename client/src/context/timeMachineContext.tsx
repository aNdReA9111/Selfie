import React, { createContext, useReducer } from "react";
import { TimeMachineState, TimeMachineAction, TimeMachineContextType } from "../utils/types";

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
  const [state, dispatch] = useReducer(timeMachineReducer, {
    offset: 0
  });

  return (
    <TimeMachineContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TimeMachineContext.Provider>
  );
  
} 
