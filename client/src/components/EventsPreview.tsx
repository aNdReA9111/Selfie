import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { EventCard } from "../components/EventCard";
import { useTimeMachineContext } from "../hooks/useTimeMachineContext";
import { Event } from "../utils/types";

export const EventsPreview: React.FC = () => {
    const [dayEvents, setDayEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
                })

                setLoading(false);
                setDayEvents(events);
            }
        } catch (error: any) {
            setLoading(false);
            console.log(error);
        }
    }

    console.log(dayEvents);

    useEffect(() => {
        getEventsOfTheDay();
    }, [offset]);

    return (
        <div className="d-flex justify-content-center align-items-start bg-secondary pt-2 e">
            {/* Add your content here if needed */}
            {loading && <div>Loading...</div>}
            <div className={`container d-flex flex-column justify-content-${dayEvents.length > 0 ? "start" : "center"} overflow-y-scroll`}>
                <h3 className="text-white">Events of the day</h3>
                {
                    dayEvents.length > 0 ?
                        dayEvents.map((e: Event) => (
                            <EventCard
                                key={e._id} // Ensure to use a unique key, assuming `e.id` exists.
                                title={e.title}
                                timezone={e.timezone}
                                date={e.date}
                                endDate={e.endDate}
                            />
                        )) :
                        <span>No Events today !!</span>
                }
            </div>
        </div>
    );
};
