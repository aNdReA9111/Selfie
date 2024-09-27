import React, { useState } from 'react';
import dayjs from 'dayjs';
import DayCell from '../components/DayCell';
import isoWeek from 'dayjs/plugin/isoWeek'; // Per rendere l'inizio settimana lunedì

import '../css/Calendar.css';

dayjs.extend(isoWeek); // Estende la gestione per avere il lunedì come primo giorno

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs()); // Data corrente (mese)
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  
  // Inizio della settimana di partenza del calendario
  const startOfCalendar = startOfMonth.startOf('isoWeek');
  // Fine della settimana del calendario
  const endOfCalendar = endOfMonth.endOf('isoWeek');

  const daysInCalendar: Array<dayjs.Dayjs> = [];
  let day = startOfCalendar;

  // Riempie l'array `daysInCalendar` con ogni giorno del calendario visualizzato
  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, 'day')) {
    daysInCalendar.push(day);
    day = day.add(1, 'day');
  }

  // Funzione per passare al mese precedente
  const prevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  // Funzione per passare al mese successivo
  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  return (
    <div className="calendar">
      <div className="d-flex justify-content-between align-items-center my-3">
        <button className="prev" onClick={prevMonth}>
          Mese Precedente
        </button>
        <h3 className='month'>{currentDate.format('MMMM YYYY')}</h3>
        <button className="next" onClick={nextMonth}>
          Mese Successivo
        </button>
      </div>

      <div className="days">
        {/* Giorni della settimana */}
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, index) => (
          <div key={index} className="day">
        {day}
          </div>
        ))}

        {/* Genera celle del calendario */}
        {daysInCalendar.map((day, index) => (
          <div key={index} className={`spacing ${day.month() === currentDate.month() ? 'day' : 'day-dis'}`}>
        <DayCell
          day={day.date()}
          isCurrentMonth={day.month() === currentDate.month()}
        />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
