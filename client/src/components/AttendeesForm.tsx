// import { useState } from "react";
// import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
// import { EventFormData } from "../utils/types";
//
// type AttendeesFormProps = {
//     register: UseFormRegister<EventFormData>;
//     errors: FieldErrors<EventFormData>;
//     setValue: UseFormSetValue<EventFormData>;
//     watch: UseFormWatch<EventFormData>;
// };
//
// export const AttendeesForm: React.FC<AttendeesFormProps> = ({ register, errors, setValue, watch }: AttendeesFormProps) => {
//     const [open, setOpen] = useState<boolean>(false);
//     const [suggestions, setSuggestions] = useState<string[]>([]);
//     const inputField: string[] | undefined | null = watch('attendees');
//     const inputText = inputField ? inputField.join(',') : "";
//
//     const getSuggestions = async (substring: string) => {
//         console.log(substring);
//         try {
//             const res = await fetch('/api/users/search', {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     credentials: "include",
//                 },
//
//                 body: JSON.stringify({ substring })
//             });
//             if (res.ok) {
//                 const data: { matchedUsernames: string[] } = await res.json();
//                 setSuggestions(data.matchedUsernames);
//             }
//         } catch (error: any) {
//             console.log(error);
//             setSuggestions([]);
//         }
//     }
//
//     const onSuggestionClick = (suggestion: string) => {
//         console.log(inputText?.slice(0, inputText?.lastIndexOf(',') + 1) + suggestion);
//         setValue('attendees', (inputText?.slice(0, inputText.lastIndexOf(',') + 1) + suggestion).split(','));
//         setOpen(false);
//     }
//
//     const onInputChange = async (e: any) => {
//         setValue('attendees', e.target.value.split(','));
//         await getSuggestions(e.target.value.slice(e.target.value.lastIndexOf(',') + 1));
//     }
//
//     return (
//         <>
//             <h4>Event Attendees</h4>
//             <div className="mb-3">
//                 <label htmlFor="attendees" className="form-label">Attendees</label>
//                 <input id="attendees" className={`form-control ${errors.attendees ? 'is-invalid' : ''}`} {...register('attendees')}
//                     onFocus={() => setOpen(true)}
//                     onChange={onInputChange} />
//                 {errors.timezone && <div className="invalid-feedback">{errors.timezone.message}</div>}
//                 <ul onBlur={() => setOpen(false)} className={`list-group ${!open ? 'd-none' : ''} scrollable-list`}>
//                     {
//                         suggestions.map((suggestion: string, index: number) => (
//                             <li className="list-group-item" key={index} onClick={() => { onSuggestionClick(suggestion) }} style={{ cursor: 'pointer' }}>
//                                 {suggestion}
//                             </li>
//                         ))
//                     }
//                 </ul>
//             </div>
//         </>
//     );
// }

import { useState } from "react";

export const AttendeesForm = ({ register, errors, setValue, watch }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const inputField = watch('attendees');
    const inputText = inputField ? inputField.join(',') : "";

    const getSuggestions = async (substring: string) => {
        console.log(substring);
        try {
            const res = await fetch('/api/users/search', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify({ substring }),
            });
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data.matchedUsernames);
            }
        } catch (error) {
            console.log(error);
            setSuggestions([]);
        }
    };

    const onSuggestionClick = (suggestion: string) => {
        console.log(inputText?.slice(0, inputText?.lastIndexOf(',') + 1) + suggestion);
        setValue('attendees', (inputText?.slice(0, inputText.lastIndexOf(',') + 1) + suggestion).split(','));
        setOpen(false);
    };

    const onInputChange = async (e: any) => {
        setValue('attendees', e.target.value.split(','));
        await getSuggestions(e.target.value.slice(e.target.value.lastIndexOf(',') + 1));
    };

    return (
        <>
            <h4>Event Attendees</h4>
            <div className="mb-3">
                <label htmlFor="attendees" className="form-label">Attendees</label>
                <input
                    id="attendees"
                    className={`form-control ${errors.attendees ? 'is-invalid' : ''}`}
                    {...register('attendees')}
                    onFocus={() => setOpen(true)}
                    onChange={onInputChange}
                />
                {errors.attendees && <div className="invalid-feedback">{errors.attendees.message}</div>}
                <ul onBlur={() => setOpen(false)} className={`list-group ${!open ? 'd-none' : ''} scrollable-list`}>
                    {
                        suggestions.map((suggestion, index) => (
                            <li
                                className="list-group-item"
                                key={index}
                                onClick={() => onSuggestionClick(suggestion)}
                                style={{ cursor: 'pointer' }}
                            >
                                {suggestion}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    );
};
