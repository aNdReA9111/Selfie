import ical, { ICalEventData } from 'ical-generator';
import { IEvent } from '../models/eventModel.js';

// Funzione per generare un calendario iCal con un array di eventi
function createICalendar(events: IEvent[]): string {
  const calendar = ical({ name: 'Calendario Eventi' });

  events.forEach(event => {
    const icalEvent: ICalEventData = {
      start: event.date,
      end: event.endDate,
      summary: event.title,
      description: event.description,
      location: event.location || '',
      url: event.url || '',
      attendees: event.attendees?.map(attendee => ({
        name: attendee.name,
        email: attendee.email,
        rsvp: attendee.responded,
        partstat: attendee.accepted ? 'ACCEPTED' : 'DECLINED',
      })),
    };
    
    calendar.createEvent(icalEvent);
  });

  // Converti il calendario in formato iCalendar (.ics)
  return calendar.toString();
}

export { createICalendar };
