import { useMemo, useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, luxonLocalizer, DateLocalizer } from 'react-big-calendar';
import { EventModalForm } from '../components/EventModalForm';
import { EventsContextType } from '../utils/types';
import { useEventsContext } from '../hooks/useEventsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { DateTime } from 'luxon';
import { Button } from 'react-bootstrap';
import { Event } from '../utils/types';
import { RRule } from 'rrule';
import { EventDetails } from '../components/EventDetails';

const localizer: DateLocalizer = luxonLocalizer(DateTime);

//TODO: delete singolo evento ricorrente
//TODO: drag and drop, aggiunta di eventi direttamente del calendario

function generateRecurringEvents(events: Event[]) {
  let calendarEvents = [];
  for(const event of events) {
    if(event.isRecurring) {
      //generate recurring events and add them to the array
      const rrule = RRule.fromString(event.recurrenceRule as string);
      const dates = rrule.all();
      for(const date of dates) {
        const calendarEvent = {
          title: event.title,
          start: date,
          end: new Date(date.getTime() + (event.duration as number)),
          resources: {
            _id: event._id
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
          _id: event._id
        }
      }
      calendarEvents.push(calendarEvent);
    }
  }

  return calendarEvents;
}

const CustomCalendar = () => {
  const { events, dispatch }: EventsContextType = useEventsContext();
  //useMemo --> ricalcolo eventi sul calendario solo quando cambiano gli eventi sul context
  const calendarEvents = useMemo(() => generateRecurringEvents(events), [events]);
  const { user } = useAuthContext();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { isLoading, error } = useEvents("/api/events/", undefined, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    }
  });

  const handleDeleteAll = async () => {
    try {
      const res = await fetch('/api/events/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        }
      })

      if (res.ok) {
        dispatch({ type: 'DELETE_ALL' });
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleSelectEvent = (e: any) => {
    setDate(e.start);
    setCurrentEvent(events.find((el: Event) => el._id === e.resources._id));
    setShowDetails(true);
  };

  // const handleSelectSlot = (slotInfo: any) => {
  // };

  return (
    isLoading ? <h2>Loading...</h2> :
    error ? <h2>{error}</h2> : ( <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            selectable
            views={['month', 'week', 'day']}
            step={15}
            timeslots={4}
            onSelectEvent={handleSelectEvent}
            // onSelectSlot={handleSelectSlot}
            style={{ height: 600 }}
            popup
          />
          <EventModalForm />
          { currentEvent && <EventDetails event={currentEvent} date={date}  show={showDetails} setShow={setShowDetails} /> }
          <Button className="mt-3" variant="danger" onClick={handleDeleteAll}>
            Delete All Events
            <i className="ms-2 bi bi-calendar2-x"></i>
          </Button>
        </div>
      </div>
    </div> )
  );
};

export default CustomCalendar;
