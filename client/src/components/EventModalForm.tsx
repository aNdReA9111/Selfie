import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { EventForm } from "./EventForm";
import { Event } from "../utils/types";

export const EventModalForm = ({ event }: { event?: Event}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant={event ? "warning" : "danger"} className={"me-3" + (event ? "" : " mt-3")} onClick={() => setShow(true)}>
        { event ? 'Modifica evento' : 'Nuovo evento'}
        { event ? <i className="ms-2 bi bi-pencil-square"></i> : <i className="ms-2 bi bi-calendar-check"></i> }
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
            { event ? 'Modifica Evento' : 'Nuovo Evento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm setShow={setShow} event={event} />
        </Modal.Body>
      </Modal>
    </>
  );
}
