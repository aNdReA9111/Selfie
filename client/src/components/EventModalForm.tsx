import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Activity, Event } from "../utils/types";
import { ActivityForm } from "./ActivityForm";
import { EventForm } from "./EventForm";

export const EventModalForm = ({ event, activity, isActivity }: { event?: Event, activity?: Activity, isActivity?: boolean }) => {
    const [show, setShow] = useState(false);
    const str: string = isActivity ? 'activity' : 'event';

    return (
        <>
            <Button variant={event ? "warning" : "danger"} className={"me-3" + (event ? "" : " mt-3")} onClick={() => setShow(true)}>
                {event || activity ? 'Edit ' + str : 'New ' + str}
                {event || activity ? <i className="ms-2 bi bi-pencil-square"></i> : <i className="ms-2 bi bi-calendar-check"></i>}
            </Button>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="xl"
                backdrop="static"
                scrollable
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {event || activity ? 'Edit ' + str : 'New ' + str}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isActivity ? <ActivityForm setShow={setShow} activity={activity} /> : <EventForm setShow={setShow} event={event} />}
                </Modal.Body>
            </Modal>
        </>
    );
}
