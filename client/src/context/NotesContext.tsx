import { createContext, useReducer } from 'react';
import { Note, NotesAction, NotesContextType, NotesState } from '../utils/types';

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

const reducer = (state: NotesState, action: NotesAction) => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        notes: action.payload,
      }
    case 'CREATE_NOTE':
      return {
        notes: [action.payload, ...state.notes],
      };
    case 'DELETE_ONE':
      return {
        notes: state.notes.filter((e: Note) => e._id !== action.payload),
      };
    case 'DELETE_ALL':
      return {
        notes: [],
      };
    case 'EDIT_NOTE':
      return {
        notes: state.notes.map((e: Note) =>
          e._id === action.payload._id
            ? {
                ...e,
                title: action.payload.title,
                description: action.payload.content,
              }
            : e
        ),
      };
    default:
      return state;
  }
};

export const NotesContextProvider = ({children}: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { notes: [] });

  return (
    <NotesContext.Provider value={{ ...state, dispatch }}>
      { children }
    </NotesContext.Provider>
  );
}
