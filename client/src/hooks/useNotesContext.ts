import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { NotesContextType } from "../utils/types";

export const useNotesContext = (): NotesContextType => {
  const context: NotesContextType | undefined = useContext(NotesContext);
  if (typeof context === "undefined") {
    throw new Error(
      "useNotesContext must be used within a NotesContextProvider",
    );
  }
  return context;
};
