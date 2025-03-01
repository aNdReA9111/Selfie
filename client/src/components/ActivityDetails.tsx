import { DateTime } from 'luxon';
import { Button, Modal } from 'react-bootstrap';
import { useActivitiesContext } from '../hooks/useActivitiesContext';
import { ActivityDetailsProps } from '../utils/types';
import { EventModalForm } from './EventModalForm';
import { useAuthContext } from '../hooks/useAuthContext';

export const ActivityDetails = ({ id, show, setShow }: ActivityDetailsProps) => {
    const { activities, dispatch } = useActivitiesContext();
    const activity = activities.find((activity) => activity._id === id);
    if (!activity) return null;

    const { user } = useAuthContext();
    const activityDate = DateTime.fromJSDate(activity?.date);
    let date2;

    if (activity.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone) {
        date2 = activityDate.setZone(activity?.timezone as string);
    } else {
        date2 = undefined;
    }

    const handleDeleteActivity = () => {
        if (activity?._id) {
            fetch(`/api/activities/${activity._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            }).then(() => {
                dispatch({ type: 'DELETE_ONE', payload: activity._id || '' });
                setShow(false);
            });
        }
    }

    return (
        activity && (
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
                        Activity Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3>{activity.title}</h3>
                            <div className='d-flex align-items-center'>
                                {activity._id_user === user._id && <Button variant="danger" className='me-2' onClick={handleDeleteActivity}>Delete<i className="ms-2 bi bi-trash"></i></Button>}
                                <EventModalForm activity={activity} isActivity={true} />
                            </div>
                        </div>
                        <p>{activity.description}</p>
                        <div>
                            {date2 && (<h5>In the actual timezone: </h5>)}
                            <p><i className="bi bi-clock-fill me-2"></i>{activityDate.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                        </div>
                        {
                            date2 && (
                                <div>
                                    <h5>In the activity's timezone: </h5>
                                    <p><i className="bi bi-clock-fill me-2"></i>{date2.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                                </div>
                            )
                        }
                    </div>
                </Modal.Body>
            </Modal>
        )
    );
}
