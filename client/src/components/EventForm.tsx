import { zodResolver } from "@hookform/resolvers/zod";
import { timeZonesNames } from "@vvo/tzdb";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { RRule } from "rrule";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEventsContext } from "../hooks/useEventsContext";
import { frequenciesMap, revereseFrequenciesMap, reverseWeekDaysMap, weekDaysMap } from "../utils/const";
import { toUTC } from "../utils/dateUtils";
import { ByDayEnum, Event, EventFormData, eventFormSchema, Frequency } from "../utils/types";
import { AttendeesForm } from "./AttendeesForm";
import { NotificationsForm } from "./NotificationsForm";
import { RRuleForm } from "./RRuleForm";

function rruleStrToObj(rule: string, zone: string) {
    const rrule = RRule.fromString(rule);

    let byday;
    if (rrule.options.byweekday) {
        if (typeof rrule.options.byweekday !== 'string') {
            byday = rrule.options.byweekday.map((day: number) => reverseWeekDaysMap[day])
        }
        else {
            byday = reverseWeekDaysMap[rrule.options.byweekday];
        }
    }

    return {
        frequency: revereseFrequenciesMap[rrule.options.freq] as Frequency,
        interval: rrule.options.interval,
        count: rrule.options.count,
        until: rrule.options.until ? DateTime.fromJSDate(rrule.options.until).setZone(zone).toFormat("yyyy-MM-dd'T'HH:mm") : undefined,
        byday,
        bymonthday: rrule.options.bymonthday,
        bymonth: rrule.options.bymonth,
        bysetpos: rrule.options.bysetpos,
    }
}


export const EventForm = ({ setShow, event, slotStart, slotEnd }: {
    setShow: Dispatch<SetStateAction<boolean>>,
    event?: Event,
    slotStart?: Date,
    slotEnd?: Date
}) => {
    const { user } = useAuthContext();
    const readonly = event ? user._id !== event._id_user : false;

    let defaultStart: string | undefined;
    let defaultEnd: string | undefined;

    if (event) {
        defaultStart = DateTime.fromJSDate(event?.date).setZone(event?.timezone).toFormat("yyyy-MM-dd'T'HH:mm")
        defaultEnd = DateTime.fromJSDate(event?.endDate).setZone(event?.timezone).toFormat("yyyy-MM-dd'T'HH:mm")
    } else if (slotStart && slotEnd) {
        defaultStart = DateTime.fromJSDate(slotStart).setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat("yyyy-MM-dd'T'HH:mm")
        defaultEnd = DateTime.fromJSDate(slotEnd).setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat("yyyy-MM-dd'T'HH:mm")
    } else {
        defaultEnd = defaultStart = undefined;
    }

    const defaultValues = {
        title: event?.title || undefined,
        description: event?.description || undefined,
        date: defaultStart,
        endDate: defaultEnd,
        isRecurring: event?.isRecurring || false,
        notifications: event?.notifications || {
            notifica_email: false,
            notifica_desktop: false,
            advance: undefined,
            advanceType: "MINUTES",
            repetitions: undefined,
            frequencyType: "MINUTELY",
            frequency: undefined,
            text: 'default text',
        },
        timezone: event?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        recurrenceRule: event?.recurrenceRule ? rruleStrToObj(event?.recurrenceRule as string, event?.timezone) : undefined,
        attendees: event?.attendees?.map((a: any) => a.name) || [],
        location: event?.location || undefined,
        url: event?.url || undefined,
        isPomodoro: event?.isPomodoro || false,
        pomodoroSetting: event?.pomodoroSetting || { studioTime: 25, riposoTime: 5, nCicli: 2, isComplete: false },
    };

    const { setValue, register, watch, handleSubmit, formState: { errors } } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: defaultValues.title,
            description: defaultValues.description,
            date: defaultValues.date,
            endDate: defaultValues.endDate,
            isRecurring: defaultValues.isRecurring,
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
            recurrenceRule: defaultValues.recurrenceRule ? {
                frequency: defaultValues.recurrenceRule?.frequency,
                interval: defaultValues.recurrenceRule?.interval,
                count: defaultValues.recurrenceRule?.count as number | undefined,
                until: defaultValues.recurrenceRule?.until,
                byday: defaultValues.recurrenceRule?.byday as ByDayEnum | ByDayEnum[] | undefined,
                bymonthday: defaultValues.recurrenceRule?.bymonthday,
                bymonth: defaultValues.recurrenceRule?.bymonth,
                bysetpos: defaultValues.recurrenceRule?.bysetpos
            } : undefined,
            attendees: defaultValues.attendees,
            location: defaultValues.location,
            url: defaultValues.url,
            isPomodoro: defaultValues.isPomodoro,
            pomodoroSetting: defaultValues.pomodoroSetting,
        } as Partial<EventFormData>,
    }
    );

    const isRecurring: boolean = watch('isRecurring');

    const isPomodoro: boolean = watch('isPomodoro');

    const [open, setOpen] = useState<boolean>(false); //for suggestions

    let suggestions: string[] = [];

    const { dispatch } = useEventsContext();

    const onSuggestionClick = (suggestion: string) => {
        setValue('timezone', suggestion);
        setOpen(false);
    }

    suggestions = timeZonesNames.filter((tz) => tz.includes(watch('timezone')));


    const onSubmit = async (data: EventFormData) => {
        console.log(data);
        if (data.isPomodoro) {
            const duration: number = (data.pomodoroSetting.studioTime + data.pomodoroSetting.riposoTime) * 60 * 1000 * data.pomodoroSetting.nCicli;
            data.endDate = DateTime.fromJSDate(data.date).plus(duration).toJSDate();
        }

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

        let rrule = undefined;
        let byweekday = undefined;


        if (data.isRecurring && typeof data.recurrenceRule === 'object') {
            //byday could be a single value or an array
            if (data.recurrenceRule!.byday) {
                if (typeof data.recurrenceRule!.byday !== 'string') {
                    byweekday = data.recurrenceRule!.byday.map((day: string) => weekDaysMap[day])
                }
                else {
                    byweekday = weekDaysMap[data.recurrenceRule!.byday];
                }
            }

            // console.log(data.recurrenceRule);
            rrule = new RRule({
                freq: frequenciesMap[data.recurrenceRule!.frequency],
                interval: data.recurrenceRule!.interval || undefined,
                dtstart: toUTC(data.date, data.timezone),
                count: data.recurrenceRule!.count,
                until: data.recurrenceRule!.until ? toUTC(data.recurrenceRule!.until, data.timezone) : undefined,
                byweekday,
                bymonthday: data.recurrenceRule!.bymonthday,
                bymonth: data.recurrenceRule!.bymonth,
                bysetpos: data.recurrenceRule!.bysetpos
            })
        }
        const newEvent = {
            title: data.title,
            description: data.description,
            date: toUTC(data.date, data.timezone),
            endDate: toUTC(data.endDate, data.timezone),
            duration: toUTC(data.endDate, data.timezone).getTime() - toUTC(data.date, data.timezone).getTime(),
            isRecurring: data.isRecurring,
            nextDate: toUTC(rrule?.after(DateTime.now().toJSDate()) || data.date, data.timezone),
            location: data.location,
            url: data.url,
            notifications,
            attendees: data.attendees?.map((a: string) => ({ name: a, email: "default@mail.com", accepted: false, responded: false })) || [],
            recurrenceRule: rrule ? rrule.toString() : undefined,
            timezone: data.timezone,
            isPomodoro: data.isPomodoro,
            pomodoroSetting: data.pomodoroSetting ? data.pomodoroSetting : { "studioTime": 5, "riposoTime": 5, "nCicli": 2, "isComplete": false },
        }

        try {
            const res = await fetch('/api/events' + (event?._id ? `/${event._id}` : ''), {
                method: event?._id ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify(newEvent)
            });
            const data: Event = await res.json();
            data.date = new Date(data.date);
            data.endDate = new Date(data.endDate);
            if (res.ok) {
                dispatch({ type: event?._id ? 'EDIT_EVENT' : 'CREATE_EVENT', payload: data });
                setShow(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    console.log(errors)

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
                            <label htmlFor="date" className="form-label">Start Date</label>
                            <input
                                id="date"
                                type="datetime-local"
                                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                {...register('date')}
                            />
                            {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                        </div>

                        {!isPomodoro &&
                            <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">End Date</label>
                                <input
                                    id="endDate"
                                    type="datetime-local"
                                    className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                                    {...register('endDate')}
                                />
                                {errors.endDate && <div className="invalid-feedback">{errors.endDate.message}</div>}
                            </div>
                        }

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                id="isRecurring"
                                className="form-check-input"
                                {...register('isRecurring')}
                            />
                            <label className="form-check-label" htmlFor="isRecurring">Is this event recurring?</label>
                        </div>
                        {isRecurring && (<RRuleForm watch={watch} register={register} errors={errors} setValue={setValue} />)}

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                id="isPomodoro"
                                className="form-check-input"
                                {...register('isPomodoro')}
                            />
                            <label className="form-check-label" htmlFor="isPomodoro">Include Pomodoro Session</label>
                        </div>

                        {isPomodoro && (
                            <div className="row">
                                <div className="col mb-3">
                                    <label className="form-label w-50 text-center">Study Time (minutes)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        step="5"
                                        className="form-control w-50"
                                        {...register('pomodoroSetting.studioTime')}
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label className="form-label w-50 text-center">Rest Time (minutes)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control w-50"
                                        {...register('pomodoroSetting.riposoTime')}
                                    />
                                </div>

                                <div className=" col mb-3">
                                    <label className="form-label w-50 text-center">Amount of cycles</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control w-50"
                                        {...register('pomodoroSetting.nCicli')}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-sm-12 col-md-6">
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

                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">
                                <i className="bi bi-geo-alt-fill"></i> Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                {...register('location')}
                            />
                            {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="url" className="form-label">
                                <i className="bi bi-link-45deg"></i> URL
                            </label>
                            <input
                                type="url"
                                id="url"
                                className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                {...register('url')}
                            />
                            {errors.url && <div className="invalid-feedback">{errors.url.message}</div>}
                        </div>
                        <AttendeesForm setValue={setValue} register={register} errors={errors} watch={watch} />
                        <NotificationsForm register={register} errors={errors} watch={watch} setValue={setValue} />

                        {errors.notifications?.root?.message && <div className="text-danger">{errors.notifications?.root.message}</div>}
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
