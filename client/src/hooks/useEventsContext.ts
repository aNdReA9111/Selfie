import { useContext } from "react";
import { EventsContext } from "../context/EventsContext";
import { EventsContextType } from "../utils/types";

export const useNotesContext = (): EventsContextType => {
  const context: EventsContextType | undefined = useContext(EventsContext);
  if (typeof context === "undefined") {
    throw new Error(
      "useNotesContext must be used within a NotesContextProvider",
    );
  }
  return context;
};
