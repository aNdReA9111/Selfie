import React, { useState } from 'react';
import CalendarEventFormDialog from './CalendarEventFormDialog';

interface DayCellProps {
  day: number;
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ day, isCurrentMonth }) => {
    const [open, setOpen] = useState(false);
  return (
    <div
      className={`border p-2 text-center ${isCurrentMonth ? '' : 'bg-light text-muted'}`}
      style={{ height: '100px', width: '100px' }}
      onClick={() => setOpen(true)}
    >
      {day}
      <CalendarEventFormDialog show={open} handleClose={() => setOpen(!open)} date={day.toString()} />
    </div>
  );
};

export default DayCell;

