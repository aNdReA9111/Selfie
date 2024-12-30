import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RRule } from 'rrule';
import { EventCard } from "../components/EventCard";
import { useTimeMachineContext } from "../hooks/useTimeMachineContext";
import { Event } from "../utils/types";

export const EventsPreview: React.FC = () => {
    const [dayEvents, setDayEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const { offset } = useTimeMachineContext();
    const getEventsOfTheDay = async () => {
        try {
            setLoading(true);
            const date: string = DateTime.now().plus(offset).toISODate();
            const res = await fetch(`/api/events?date=${date}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            });

            if (res.ok) {
                const events: Event[] = await res.json();
                events.forEach((e: Event) => {
                    e.date = new Date(e.date);
                    e.endDate = new Date(e.endDate);
                });

                setLoading(false);
                setDayEvents(events);
            }
        } catch (error: any) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        getEventsOfTheDay();
    }, [offset]);


    return (
        <div className="d-flex justify-content-center align-items-start pt-2 e">
            {/* Add your content here if needed */}
            <div className="h-100 container d-flex flex-column justify-content-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h2>Events of the day</h2>
                    <button className="btn btn-danger" onClick={() => navigate("/calendar/")}>Go to Calendar<i className="bi bi-box-arrow-up-right ms-2"></i></button>
                </div>
                <div id="eventsCards">
                    {
                        dayEvents.length > 0 ?
                            dayEvents.map((e: Event) => {
                                let dates: { start: Date, end: Date } = {
                                    start: e.date,
                                    end: e.endDate
                                }

                                /* caclulate right occurence date in case of recurring event */
                                if (e.isRecurring) {
                                    const rrule = RRule.fromString(e.recurrenceRule as string);
                                    const occurrences: Date[] = rrule.between(
                                        new Date(new Date(DateTime.now().plus(offset).toMillis()).setHours(0, 0, 0, 0)),
                                        new Date(new Date(DateTime.now().plus(offset).toMillis()).setHours(23, 59, 59, 999)),
                                        true
                                    );
                                    dates = {
                                        start: occurrences[0],
                                        end: DateTime.fromJSDate(occurrences[0]).plus(e.duration as number).toJSDate()
                                    }
                                }

                                return <EventCard
                                    key={e._id} // Ensure to use a unique key, assuming `e.id` exists.
                                    title={e.title}
                                    timezone={e.timezone}
                                    date={dates.start}
                                    endDate={dates.end}
                                />
                            }) :
                            <span>No Events today !!</span>
                    }
                    {loading && <Spinner animation="border" variant="danger" />}
                </div>
            </div>
        </div>
    );
};
