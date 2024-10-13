import { createContext, useReducer } from 'react';
import { Note, NotesAction, NotesContextType, NotesState } from '../utils/types';

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

const reducer = (state: NotesState, action: NotesAction): NotesState => {
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
    case 'SORT_BY_DATE':
      return {
        notes: state.notes.sort((a: Note, b: Note) => {
          if (a.created.getTime() > b.created.getTime()) {
            return -1;
          }
          if (a.created.getTime() < b.created.getTime()) {
            return 1;
          }
          return 0;
        })
      }
    case 'SORT_BY_TITLE':
      return {
        notes: state.notes.sort((a: Note, b: Note) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          }
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          }
          return 0;
        })
      }
    case 'SORT_BY_CONTENT':
      return {
        notes: state.notes.sort((a: Note, b: Note) => {
          if (a.content.length < b.content.length) {
            return -1;
          }
          if (a.content.length > b.content.length) {
            return 1;
          }
          return 0;
        })
      }

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
