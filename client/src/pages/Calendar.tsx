import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { Calendar as BigCalendar, DateLocalizer, luxonLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from 'react-bootstrap';
import { RRule } from 'rrule';
import { ActivityDetails } from '../components/ActivityDetails';
import { DNDEventModalForm } from '../components/DNDEventModalForm';
import { EventComponent } from '../components/EventComponent';
import { EventDetails } from '../components/EventDetails';
import { EventModalForm } from '../components/EventModalForm';
import { useActivities } from '../hooks/useActivities';
import { useActivitiesContext } from '../hooks/useActivitiesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEvents } from '../hooks/useEvents';
import { useEventsContext } from '../hooks/useEventsContext';
import { useTimeMachineContext } from '../hooks/useTimeMachineContext';
import { ActivitiesContextType, Activity, Event, EventsContextType } from '../utils/types';

const localizer: DateLocalizer = luxonLocalizer(DateTime);

//TODO: delete singolo evento ricorrente
//TODO: drag and drop, aggiunta di eventi direttamente del calendario

function generateRecurringEvents(events: Event[], activities: Activity[]) {
    let calendarEvents = [];
    for (const event of events) {
        if (event.isRecurring) {
            //generate recurring events and add them to the array
            const rrule = RRule.fromString(event.recurrenceRule as string);
            const dates = rrule.all();
            for (const date of dates) {
                const calendarEvent = {
                    title: event.title,
                    start: date,
                    end: new Date(date.getTime() + (event.duration as number)),
                    resources: {
                        _id: event._id,
                        isActivity: false
                    }
                }
                calendarEvents.push(calendarEvent);
            }
        } else {
            const calendarEvent = {
                title: event.title,
                start: event.date,
                end: event.endDate,
                resources: {
                    _id: event._id,
                    isActivity: false
                }
            }
            calendarEvents.push(calendarEvent);
        }
    }
    for (const activity of activities) {
        const calendarEvent = {
            title: activity.title,
            start: activity.date,
            end: activity.date,
            // end: new Date(activity.date.getTime() + 30 * 60 * 1000),
            resources: {
                _id: activity._id,
                isActivity: true
            }
        }
        calendarEvents.push(calendarEvent);
    }

    return calendarEvents;
}

const CustomCalendar = () => {
    const { events, dispatch: dispatchE }: EventsContextType = useEventsContext();
    const { activities, dispatch: dispatchA }: ActivitiesContextType = useActivitiesContext();
    const { user } = useAuthContext();
    console.log(user.token)
    const { offset } = useTimeMachineContext();
    //useMemo --> ricalcolo eventi sul calendario solo quando cambiano gli eventi sul context
    const calendarEvents = useMemo(() => generateRecurringEvents(events, activities), [events, activities, offset]);
    const [showDetailsA, setShowDetailsA] = useState<boolean>(false);
    const [showDetailsE, setShowDetailsE] = useState<boolean>(false);
    const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
    const [currentActivity, setCurrentActivity] = useState<Activity | undefined>(undefined);
    const [date, setDate] = useState<Date | undefined>(undefined);
    /*slot interval*/
    const [slotStart, setSlotStart] = useState<Date | undefined>(undefined);
    const [slotEnd, setSlotEnd] = useState<Date | undefined>(undefined);
    const [showDND, setShowDND] = useState<boolean>(false);

    const { isLoading: isLoadingE, error: errorE } = useEvents("/api/events/", undefined, {
        headers: {
            'Content-Type': 'application/json',
            credentials: "include",
        }
    }, [offset]);

    const { isLoading: isLoadingA, error: errorA } = useActivities("/api/activities/", undefined, {
        headers: {
            'Content-Type': 'application/json',
            credentials: "include",
        }
    }, [offset]);

    const handleDeleteAllE = async () => {
        try {
            const res = await fetch('/api/events/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            })

            if (res.ok) {
                dispatchE({ type: 'DELETE_ALL' });
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleDeleteAllA = async () => {
        try {
            const res = await fetch('/api/activities/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            })

            if (res.ok) {
                dispatchA({ type: 'DELETE_ALL' });
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleSelectEvent = (e: any) => {
        setDate(e.start);
        if (e.resources.isActivity === true) {
            setCurrentActivity(activities.find((el: Activity) => el._id === e.resources._id));
            setShowDetailsA(true);
        } else {
            setCurrentEvent(events.find((el: Event) => el._id === e.resources._id));
            setShowDetailsE(true);
        }
    };

    const handleExportCalendar = async () => {
        try {
            const response = await fetch('/api/events/export-events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify({
                    userId: user?._id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Errore nell\'esportazione del calendario');
            }

            // Ottieni il contenuto del calendario come stringa
            const calendarData = await response.text();

            // Crea un Blob con il contenuto del calendario
            const blob = new Blob([calendarData], { type: 'text/calendar' });

            // Crea un URL per il blob
            const url = window.URL.createObjectURL(blob);

            // Crea un elemento <a> per il download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'calendario.ics';

            // Aggiungi il link al documento e simula il click
            document.body.appendChild(link);
            link.click();

            // Pulisci rimuovendo il link e revocando l'URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Notifica successo
            alert('Calendario esportato con successo!');

        } catch (error) {
            console.error('Errore nell\'esportazione del calendario:', error);
            alert(error instanceof Error ? error.message : 'Errore sconosciuto');
        }
    };

    const handleSelectSlot = (slotInfo: any) => {
        console.log(slotInfo);
        setSlotStart(slotInfo.start);
        setSlotEnd(slotInfo.end);
        setShowDND(true);
    };

    return (
        isLoadingA || isLoadingE ? <h2>Loading...</h2> :
            errorA || errorE ? <h2>{errorA || ""} + "\n" + {errorE || ""}</h2> : (<div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <BigCalendar
                            localizer={localizer}
                            components={{ event: EventComponent }}
                            events={calendarEvents}
                            selectable
                            views={['month', 'week', 'day']}
                            step={15}
                            timeslots={4}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            style={{ height: 600 }}
                            defaultDate={DateTime.now().plus(offset || 0).toJSDate()}  /*update current date to time machine date*/
                            getNow={() => DateTime.now().plus(offset || 0).toJSDate()}
                            popup
                        />
                        <DNDEventModalForm slotStart={slotStart} slotEnd={slotEnd} show={showDND} setShow={setShowDND} />
                        <EventModalForm isActivity={false} />
                        <EventModalForm isActivity={true} />
                        {currentEvent && <EventDetails id={currentEvent._id} date={date} show={showDetailsE} setShow={setShowDetailsE} />}
                        {currentActivity && <ActivityDetails id={currentActivity._id} show={showDetailsA} setShow={setShowDetailsA} />}
                        <Button className="mt-3" variant="danger" onClick={handleDeleteAllE}>
                            Delete All Events
                            <i className="ms-2 bi bi-calendar2-x"></i>
                        </Button>
                        <Button className="mt-3" variant="danger" onClick={handleDeleteAllA}>
                            Delete All Activities
                            <i className="ms-2 bi bi-calendar2-x"></i>
                        </Button>

                        <Button className="mt-3" variant="secondary" onClick={handleExportCalendar}>
                            Export Calendar
                            <i className="ms-2 bi bi-calendar2-x"></i>
                        </Button>
                    </div>
                </div>
            </div>)
    );
};

export default CustomCalendar;
