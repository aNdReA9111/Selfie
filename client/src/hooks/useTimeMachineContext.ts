import { useContext } from "react";
import { TimeMachineContext } from "../context/timeMachineContext";


export const useTimeMachineContext = () => {
    const context = useContext(TimeMachineContext);
    if (!context) {
        throw new Error("useTimeMachineContext must be used within a TimeMachineContextProvider");
    }
    return context;
};
