import { DateTime } from 'luxon';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RRule } from 'rrule';
import { useEventsContext } from '../hooks/useEventsContext';
import { EventDetailsProps } from '../utils/types';
import { EventModalForm } from './EventModalForm';

export const EventDetails = ({ id, date, show, setShow }: EventDetailsProps) => {
    const { events, dispatch } = useEventsContext();
    const event = events.find((event) => event._id === id);
    if (!event) return null;

    const start = event?.isRecurring === false ? DateTime.fromJSDate(event?.date) : DateTime.fromJSDate(date as Date);
    const end = event?.isRecurring === false ? DateTime.fromJSDate(event?.endDate) : DateTime.fromJSDate(date as Date).plus(event?.duration as number);
    const rruleString = event?.isRecurring === false ? undefined : RRule.fromString(event?.recurrenceRule as string).toText();
    let start2, end2;

    const navigate = useNavigate();

    if (event.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone) {
        start2 = start.setZone(event?.timezone as string);
        end2 = end.setZone(event?.timezone as string);
    } else {
        start2 = end2 = undefined;
    }

    const handleDeleteEvent = () => {
        if (event?._id) {
            fetch(`/api/events/${event._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            }).then(() => {
                dispatch({ type: 'DELETE_ONE', payload: event._id || '' });
                setShow(false);
            });
        }
    }

    const navigateToPomodoro = () => {
        navigate('/pomodoro', {
            state:
            {
                eventIdFromEvent: event?._id,
                settingFromEvent: event?.pomodoroSetting,
                isRecurFromEvent: event?.isRecurring
            }
        });
    };

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
                            <div className='d-flex align-items-center'>
                                {!event.isRecurring && <Button variant="danger" className='me-2' onClick={handleDeleteEvent}>Delete<i className="ms-2 bi bi-trash"></i></Button>}
                                <EventModalForm event={event} isActivity={false} />
                            </div>
                        </div>
                        <p>{event.description}</p>
                        <div>
                            {start2 && end2 && (<h5>In the actual timezone: </h5>)}
                            <p><i className="bi bi-clock-fill me-2"></i>{start.toLocaleString(DateTime.DATETIME_SHORT)} - {end.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                        </div>
                        {event.url && <p><i className="bi bi-link-45deg me-2"></i><a href={event.url}>{event.url}</a></p>}
                        {event.location && <p><i className="bi bi-geo-alt-fill me-2"></i>{event.location}</p>}
                        {rruleString && <p>Recurrency pattern: {rruleString}</p>}
                        {
                            start2 && end2 && (
                                <div>
                                    {start2 && end2 && (<h5>In the event's timezone: </h5>)}
                                    <p><i className="bi bi-clock-fill me-2"></i>{start2.toLocaleString(DateTime.DATETIME_SHORT)} - {end2.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                                </div>
                            )
                        }
                        <div>
                            {event.isPomodoro && (
                                <>
                                    {(event?.pomodoroSetting.nCicli>0) && (
                                        <div className="p-3 rounded border bg-light">
                                            <div className="container">
                                                <div className= "row text-center">
                                                    <div className="col">
                                                        <i className="bi bi-clock-fill text-primary fs-3"></i>
                                                        <p className="mb-1">Study time</p>
                                                        <p className="fs-5 fw-bold">{event?.pomodoroSetting.studioTime}'</p>
                                                    </div>
                                                    <div className="col">
                                                        <i className="bi bi-pause-circle-fill text-success fs-3"></i>
                                                        <p className="mb-1">Rest time</p>
                                                        <p className="fs-5 fw-bold">{event?.pomodoroSetting.riposoTime}'</p>
                                                    </div>
                                                    <div className="col">
                                                        <span className="fs-3">&#x21bb;</span> 
                                                        {/* <i className="bi bi-arrow-repeat text-warning fs-3"></i> */}
                                                        <p className="mb-1">Remaining cycles</p>
                                                        <p className="fs-5 fw-bold">{event?.pomodoroSetting.nCicli}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center mt-3">
                                                <Button variant="primary" onClick={navigateToPomodoro}>Open Pomodoro App</Button>
                                            </div>
                                        </div>
                                    )}  
                                    {(event?.pomodoroSetting.nCicli<=0) && (
                                        <p className="fs-5 fw-bold">This study session has been completed</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    );
}
