import { useContext } from "react";
import { ActivitiesContext } from "../context/ActivitiesContext";
import { ActivitiesContextType } from "../utils/types";

export const useActivitiesContext = (): ActivitiesContextType => {
    const context: ActivitiesContextType | undefined = useContext(ActivitiesContext);
    if (typeof context === "undefined") {
        throw new Error(
            "useActivitiesContext must be used within a ActivitiesContextProvider",
        );
    }
    return context;
};
