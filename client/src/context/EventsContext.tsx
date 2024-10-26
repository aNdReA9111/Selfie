import { createContext, useReducer } from 'react';
import { Event, EventsAction, EventsContextType, EventsState } from '../utils/types';

export const EventsContext = createContext<EventsContextType | undefined>(undefined);

const reducer = (state: EventsState, action: EventsAction): EventsState => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        events: action.payload,
      }
    case 'CREATE_EVENT':
      return {
        events: [action.payload, ...state.events],
      };
    case 'DELETE_ONE':
      return {
        events: state.events.filter((e: Event) => e._id !== action.payload),
      };
    case 'DELETE_ALL':
      return {
        events: [],
      };
    case 'EDIT_EVENT':
      return {
        events: state.events.map((e: Event) =>
          e._id === action.payload._id
            ? {
                ...e,
                ...action.payload, //volti aggiurnati che sostituiscono i vecchi 
              }
            : e
        ),
      };
    default:
      return state;
  }
};

export const EventsContextProvider = ({children}: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { events: [] });

  return (
    <EventsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </EventsContext.Provider>
  );
}
