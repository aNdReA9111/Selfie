import { createContext, useReducer } from 'react';
import { ActivitiesAction, ActivitiesContextType, ActivitiesState, Activity } from '../utils/types';

export const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

const reducer = (state: ActivitiesState, action: ActivitiesAction): ActivitiesState => {
    switch (action.type) {
        case 'SET_ACTIVITIES':
            return {
                activities: action.payload,
            }
        case 'ADD_ACTIVITIES':
            return {
                activities: state.activities.concat(action.payload),
            }
        case 'CREATE_ACTIVITY':
            console.log(action.payload)
            return {
                activities: [action.payload, ...state.activities],
            };
        case 'DELETE_ONE':
            return {
                activities: state.activities.filter((e: Activity) => e._id !== action.payload),
            };
        case 'DELETE_ALL':
            return {
                activities: [],
            };
        case 'EDIT_ACTIVITY':
            return {
                activities: state.activities.map((e: Activity) =>
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

export const ActivitiesContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, { activities: [] });

    return (
        <ActivitiesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ActivitiesContext.Provider>
    );
}
