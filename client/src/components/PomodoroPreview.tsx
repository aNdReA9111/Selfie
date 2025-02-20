import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { RRule } from "rrule";
import { useTimeMachineContext } from "../hooks/useTimeMachineContext";
import { Event } from "../utils/types";
import { PomConfiguration } from "./PomConfiguration";

export const PomodoroPreview = () => {
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { offset } = useTimeMachineContext();

    const navigateToPomodoro = () => {
        navigate('/pomodoro', {
            state:
            {
                eventIdFromEvent: event?._id,
                settingFromEvent: event?.pomodoroSetting,
                isRecurFromEvent: event?.isRecurring
            }
        });
    };
    const getNextPomodoroEvent = async () => {
        try {
            setLoading(true);
            const date: string = DateTime.now().plus(offset).toISODate();
            const res = await fetch(`/api/events?nextPom=true&date=${date}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            });

            if (res.ok) {
                const pomEvent: Event[] = await res.json();
                pomEvent.forEach((e: Event) => {
                    e.date = new Date(e.date);
                    e.endDate = new Date(e.endDate as Date);
                })

                setLoading(false);
                console.log(pomEvent);
                if (pomEvent.length > 0)
                    setEvent(pomEvent[0]);
            } else
                console.log(res);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        getNextPomodoroEvent();
    }, [offset]);

    let dates: { start: Date, end: Date } | undefined = undefined;
    if (event) {
        dates = {
            start: event.date,
            end: event.endDate as Date
        }

        /* caclulate right occurence date in case of recurring event */
        if (event.isRecurring) {
            const rrule = RRule.fromString(event.recurrenceRule as string);
            const occurrence: Date = rrule.after(
                new Date(new Date(DateTime.now().plus(offset).toMillis()).setHours(0, 0, 0, 0)),
            ) as Date;
            dates = {
                start: occurrence,
                end: DateTime.fromJSDate(occurrence).plus(event.duration as number).toJSDate()
            }
        }
    }

    return (
        <div className="d-flex flex-column container p">
            {event && <h2>Next Planned Study Session: {event.title}</h2>}
            {event && dates && <h6><i className="bi bi-clock me-2"></i>{dates.start.toLocaleString()} - {dates.end.toLocaleString()}</h6>}
            {event && <PomConfiguration pomodoroSetting={event?.pomodoroSetting} navigateToPomodoro={navigateToPomodoro} />}
            {loading && <Spinner animation="border" variant="danger" />}
            {!event && !loading && <h3>No Pomodoro Events Planned</h3>}
        </div>
    );
};
