import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { EventForm } from "./EventForm";

export const EventModalForm = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="danger" className="mt-3 me-3" onClick={() => setShow(true)}>
        Create New Event
        <i className="ms-2 bi bi-calendar-check"></i>
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
            Create New Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm setShow={setShow} />
        </Modal.Body>
      </Modal>
    </>
  );
}
