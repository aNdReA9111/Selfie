import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { EventForm } from "./EventForm";

export const EventModalForm = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Create New Event
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
          <EventForm /> 
        </Modal.Body>
      </Modal>
    </>
  );
}
