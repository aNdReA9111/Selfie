import { useEvents } from '../hooks/useEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, luxonLocalizer, DateLocalizer } from 'react-big-calendar';
import { EventModalForm } from '../components/EventModalForm';
import { EventsContextType } from '../utils/types';
import { useEventsContext } from '../hooks/useEventsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { DateTime } from 'luxon';
import { Button } from 'react-bootstrap';

const localizer: DateLocalizer = luxonLocalizer(DateTime);

//TODO: timezone per bene
//TODO: generazione eventi ricorrenti
//TODO: minor fix form
//TODO: update evento, delete singolo evento, visualizzazione singolo evento
//TODO: drag and drop, aggiunta di eventi direttamente del calendario


// function generateRecurringEvents(events: Event[]): Event[] {
//   let calendarEvents: Event[] = [];
//   for(event of events) {
//     if(event.isRecurring) {
//       //generate recurring events and add them to the array
//     } else {
//       calendarEvents.push(event)
//     }
//   }
//
//   return calendarEvents;
// }

const CustomCalendar = () => {
  const { events, dispatch }: EventsContextType = useEventsContext();
  const { user } = useAuthContext();

  const { isLoading, error } = useEvents("http://localhost:4000/api/events", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    }
  });

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/events/`, {
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

  // const handleSelectEvent = (event: BigCalendarEvent) => {
  //   alert(event.title);
  // };
  //
  // const handleSelectSlot = (slotInfo: any) => {
  // };

  console.log(events)

  return (
    isLoading ? <h2>Loading...</h2> :
    error ? <h2>{error}</h2> : ( <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="date"
            endAccessor="endDate"
            selectable
            views={['month', 'week', 'day']}
            step={15}
            timeslots={4}
            // onSelectEvent={handleSelectEvent}
            // onSelectSlot={handleSelectSlot}
            style={{ height: 600 }}
            popup
          />
          <EventModalForm />
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
