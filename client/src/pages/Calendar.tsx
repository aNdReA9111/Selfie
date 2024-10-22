import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, Event, dayjsLocalizer, DateLocalizer } from 'react-big-calendar';

import 'bootstrap/dist/css/bootstrap.min.css';

import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { EventModalForm } from '../components/EventModalForm';


// Aggiungi i plugin necessari a dayjs
dayjs.extend(weekday);
dayjs.extend(localeData);

// DA MODIFICARE IN USEEVENTS 
interface IEvent {
  _id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
  url?: string;
  duration: number;
  recurrencyRule: {
    isRecurring: boolean;
    frequency?: string;
    repetition?: number;
    interval: number;
    byday?: string[];
    bymonthday?: number[];
    bymonth?: number[];
    end?: string;
    endDate?: Date;
  };
  attendees?: {
    name: string;
    email: string;
    responded: boolean;
    accepted: boolean;
  }[];
  notifications: {
    notifica_email: boolean;
    notifica_desktop: boolean;
    notifica_alert: boolean;
    text: string;
  }[];
  _id_user: string;
}

// Configura il localizer per Day.js
const localizer: DateLocalizer = dayjsLocalizer(dayjs);


const CustomCalendar = () => {
  const [events, setEvents] = useState<IEvent[]>([
    {
      _id: '1',
      title: 'Evento di esempio',
      description: 'Descrizione dell\'evento di esempio',
      start: dayjs('2024-10-08T10:00:00').toDate(),
      end: dayjs('2024-10-08T12:00:00').toDate(),
      location: 'Location di esempio',
      url: 'http://example.com',
      duration: 120,
      recurrencyRule: {
        isRecurring: false,
        interval: 1,
      },
      notifications: [
        {
          notifica_email: true,
          notifica_desktop: false,
          notifica_alert: true,
          text: 'Notifica di esempio',
        },
      ],
      _id_user: 'user1',
    },
  ]);

  useEffect(() => {
    // fetch dal db
    
  }, []);

  const handleSelectEvent = (event: Event) => {
    alert(event.title);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const title = window.prompt('Nome nuovo evento');
    if (title) {
      setEvents((prev) => [
        ...prev,
        
        {
          _id: (prev.length + 1).toString(),
          title,
          description: '',
          start: slotInfo.start,
          end: slotInfo.end,
          location: '',
          url: '',
          duration: dayjs(slotInfo.end).diff(dayjs(slotInfo.start), 'seconds'),
          recurrencyRule: {
            isRecurring: false,
            interval: 1,
          },
          notifications: [],
          _id_user: 'user1',
        },
      ]);
    }
  };

return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            style={{ height: 500 }}
            popup
          />
          <EventModalForm />
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
