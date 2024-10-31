import { EventDetailsProps } from '../utils/types';
import { DateTime } from 'luxon';
import { Modal, Button } from 'react-bootstrap';
import { RRule } from 'rrule';

/*
Icons:
<i class="bi bi-pen"></i> --> edit
<i class="bi bi-trash"></i> --> delete

*/

export const EventDetails = ({event, date, show, setShow}: EventDetailsProps) => {
  if(!event) return null;

  const start = event?.isRecurring === false ? DateTime.fromJSDate(event?.date) : DateTime.fromJSDate(date as Date);
  const end = event?.isRecurring === false ? DateTime.fromJSDate(event?.endDate) : DateTime.fromJSDate(date as Date).plus(event?.duration as number);
  const rruleString = event?.isRecurring === false ? undefined: RRule.fromString(event?.recurrenceRule as string).toText();
  
  const handleDeleteEvent = () => {
    
  }

  return (
    event && (
      <Modal
        show={show}
        onHide={() => { setShow(false); }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
        backdrop="static"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Event Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h3>{event.title}</h3>
              <Button variant="danger" onClick={handleDeleteEvent}>Remove<i className="ms-2 bi bi-trash"></i></Button>
            </div>
            <p>{event.description}</p>
            <p>{event.location}</p>
            <p>Start: {start.toLocaleString(DateTime.DATETIME_SHORT)}</p>
            <p>End: {end.toLocaleString(DateTime.DATETIME_SHORT)}</p>
            {event.url && <p>{event.url}</p>}
            {event.location && <p>{event.location}</p>}
            {rruleString && <p>{rruleString}</p>}
          </div>
        </Modal.Body>
      </Modal>
    )
  );
}
