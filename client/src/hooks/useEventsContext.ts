import { useContext } from "react";
import { EventsContext } from "../context/EventsContext";
import { EventsContextType } from "../utils/types";

export const useEventsContext = (): EventsContextType => {
  const context: EventsContextType | undefined = useContext(EventsContext);
  if (typeof context === "undefined") {
    throw new Error(
      "useEventsContext must be used within a EventsContextProvider",
    );
  }
  return context;
};
