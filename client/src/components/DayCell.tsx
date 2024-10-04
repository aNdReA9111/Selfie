// import React, { useState } from 'react';
// import CalendarEventFormDialog from './CalendarEventFormDialog';

interface DayCellProps {
  day: number;
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ day, isCurrentMonth }) => {
  // const [open, setOpen] = useState(false);
  
  return (
    <div
      className={`border-top border-start rounded-2 mb-2 text-center ${isCurrentMonth ? '' : 'bg-light text-muted'}`}
      style={{ cursor: 'pointer', maxHeight: '4rem', width: '3rem'}}
      // onClick={() => setOpen(true)}
    >
      {day}
      {/* <CalendarEventFormDialog show={open} handleClose={() => setOpen(!open)} date={day.toString()} /> */}
    </div>
  );
};

export default DayCell;
