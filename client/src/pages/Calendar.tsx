import React, { useState } from 'react';
import dayjs from 'dayjs';
import DayCell from '../components/DayCell';
import DayDetails from '../components/DayDetails';
import isoWeek from 'dayjs/plugin/isoWeek'; // Per rendere l'inizio settimana lunedì

// import '../css/Calendar.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

dayjs.extend(isoWeek); // Estende la gestione per avere il lunedì come primo giorno

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs()); // Data corrente (mese)
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');

  const startOfCalendar = startOfMonth.startOf('isoWeek'); // Inizio della settimana di partenza del calendario
  const endOfCalendar = endOfMonth.endOf('isoWeek'); // Fine della settimana del calendario

  const daysInCalendar: Array<dayjs.Dayjs> = [];
  let day = startOfCalendar;

  const [date, setDate] = useState(currentDate.format('DD-MM-YYYY'));
  const [events, setEvents] = useState([
    { id: 1, time: '10:00', description: 'Meeting' },
    { id: 2, time: '12:00', description: 'Lunch' },
    { id: 3, time: '14:00', description: 'Workshop' },
  ]);

  // Riempie l'array `daysInCalendar` con ogni giorno del calendario visualizzato
  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, 'day')) {
    daysInCalendar.push(day);
    day = day.add(1, 'day');
  }

  return (
    <div className="d-flex flex-row flex-wrap flex-xl-nowrap align-content-stretch">
      <div className="container text-center grid gap-3">
        <div className="d-flex justify-content-between align-items-center my-3">
          <button className="btn btn-outline-primary" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>
            Mese Precedente
          </button>
          <h3 className='month'>{currentDate.format('MMMM YYYY')}</h3>
          <button className="btn btn-outline-primary" onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>
            Mese Successivo
          </button>
        </div>

        <div className="d-flex flex-column ">
          {/* Giorni della settimana */}
          <div 
            className="row"
          >
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, index) => (
                <div key={index} className="col text-center font-weight-bold" style={{ maxHeight: '50px', width: '100%' }}>
                <div className="day" style={{ height: '4rem', width: '3rem'}} >{day}</div>
                </div>
            ))}
          </div>

          {/* Genera celle del calendario */}
          {Array.from({ length: Math.ceil(daysInCalendar.length / 7) }).map((_, weekIndex) => (
            <div className="row" key={weekIndex}>
              {daysInCalendar.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, index) => (
                <div onClick={() => setDate(day.format('DD-MM-YYYY'))} key={index} className={`col text-center ${day.month() === currentDate.month() ? 'day' : 'day-dis'}`}>
                  <DayCell
                    day={day.date()}
                    isCurrentMonth={day.month() === currentDate.month()}
                  />
                </div>
              ))}
            </div>
          ))}

          

        </div>
      </div>
      <DayDetails
        selectedDay={date}
        events={events}
      />
    </div>
  );
};

export default Calendar;
