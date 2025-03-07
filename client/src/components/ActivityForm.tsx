import { zodResolver } from "@hookform/resolvers/zod";
import { timeZonesNames } from "@vvo/tzdb";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useActivitiesContext } from "../hooks/useActivitiesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { toUTC } from "../utils/dateUtils";
import { Activity, ActivityFormData, activityFormSchema } from "../utils/types";
import { AttendeesForm } from "./AttendeesForm";
import { NotificationsForm } from "./NotificationsForm";

export const ActivityForm = ({ setShow, activity }: { setShow: Dispatch<SetStateAction<boolean>>, activity?: Activity }) => {
    const { user } = useAuthContext();
    const readonly = activity ? user._id !== activity._id_user : false;

    const defaultValues = {
        title: activity?.title || undefined,
        description: activity?.description || undefined,
        date: activity?.date ? DateTime.fromJSDate(activity?.date).setZone(activity?.timezone).toFormat("yyyy-MM-dd'T'HH:mm") : undefined,
        isCompleted: activity?.isCompleted || false,
        notifications: activity?.notifications || {
            notifica_email: false,
            notifica_desktop: false,
            advance: undefined,
            advanceType: "MINUTES",
            repetitions: undefined,
            frequencyType: "MINUTELY",
            frequency: undefined,
            text: 'default text',
        },
        timezone: activity?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        attendees: activity?.attendees?.map((a: any) => a.name) || [],
    };

    const { setValue, register, watch, handleSubmit, formState: { errors } } = useForm<ActivityFormData>({
        resolver: zodResolver(activityFormSchema),
        defaultValues: {
            title: defaultValues.title,
            description: defaultValues.description,
            date: defaultValues.date,
            notifications: {
                notifica_email: defaultValues.notifications?.notifica_email,
                notifica_desktop: defaultValues.notifications?.notifica_desktop,
                advance: defaultValues.notifications?.advance,
                advanceType: defaultValues.notifications?.advanceType as "MINUTES" | "HOURS" | "DAYS",
                repetitions: defaultValues.notifications?.repetitions,
                frequencyType: defaultValues.notifications?.frequencyType,
                frequency: defaultValues.notifications?.frequency,
                text: defaultValues.notifications?.text
            },
            timezone: defaultValues.timezone,
            attendees: defaultValues.attendees,
            isCompleted: defaultValues.isCompleted,
        } as Partial<ActivityFormData>,
    }
    );

    const [open, setOpen] = useState<boolean>(false); //for suggestions

    let suggestions: string[] = [];

    const { dispatch } = useActivitiesContext();

    const onSuggestionClick = (suggestion: string) => {
        setValue('timezone', suggestion);
        setOpen(false);
    }

    suggestions = timeZonesNames.filter((tz) => tz.includes(watch('timezone')));


    const onSubmit = async (data: ActivityFormData) => {
        console.log(data);

        const notifications = {
            notifica_email: data.notifications?.notifica_email,
            notifica_desktop: data.notifications?.notifica_desktop,
            advance: data.notifications?.advance,
            advanceType: data.notifications?.advanceType,
            repetitions: data.notifications?.repetitions,
            frequencyType: data.notifications?.frequencyType,
            frequency: data.notifications?.frequency,
            text: data.notifications?.text,
            before: (data.notifications?.notifica_desktop || data.notifications?.notifica_email) ? true : undefined
        }

        const newActivity = {
            title: data.title,
            description: data.description,
            date: toUTC(data.date, data.timezone),
            notifications,
            attendees: data.attendees?.map((a: string) => ({ name: a, email: user.email, accepted: false, responded: false })) || [],
            timezone: data.timezone,
            isCompleted: data.isCompleted
        }

        try {
            const res = await fetch('/api/activities' + (activity?._id ? `/${activity._id}` : ''), {
                method: activity?._id ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify(newActivity)
            });
            console.log(res);
            const data: Activity = await res.json();
            //SISTEMA TIMEZONE QUI
            console.log(data);
            data.date = new Date(data.date);
            if (res.ok) {
                dispatch({ type: activity?._id ? 'EDIT_ACTIVITY' : 'CREATE_ACTIVITY', payload: data });
                setShow(false);
            }
        } catch (error) {
            console.error("ERR:" + error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={readonly}>
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                id="title"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                {...register('title')}
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                {...register('description')}
                                rows={5}
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                id="date"
                                type="datetime-local"
                                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                {...register('date')}
                            />
                            {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="timezone" className="form-label">Timezone</label>
                            <input id="timezone" className={`form-control ${errors.timezone ? 'is-invalid' : ''}`} {...register('timezone')} onFocus={() => setOpen(true)} />
                            {errors.timezone && <div className="invalid-feedback">{errors.timezone.message}</div>}
                            <ul onBlur={() => setOpen(false)} className={`list-group ${!open ? 'd-none' : ''} scrollable-list`}>
                                {
                                    suggestions.map((suggestion: string, index: number) => (
                                        <li className="list-group-item" key={index} onClick={() => { onSuggestionClick(suggestion) }} style={{ cursor: 'pointer' }}>
                                            {suggestion}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        {/* cannot mark an activity as completed when creating it --> activity && */}
                        {activity && <div className="mb-3 form-check form-check-inline">
                            <label htmlFor="isCompleted" className="form-label">Mark as completed</label>
                            <input type="checkbox" id="isCompleted" className="form-check-input" {...register('isCompleted')} />
                            {errors.isCompleted && <div className="invalid-feedback">{errors.isCompleted.message}</div>}
                        </div>}

                    </div>
                    <div className="col-sm-12 col-md-6">
                        <AttendeesForm setValue={setValue} register={register} errors={errors} watch={watch} />
                        <NotificationsForm register={register} errors={errors} watch={watch} setValue={setValue} />
                        <button className="btn btn-danger mt-3" type="submit">
                            Submit
                            <i className="ms-2 bi bi-send"></i>
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    )
}
