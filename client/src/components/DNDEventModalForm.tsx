import { Modal } from "react-bootstrap";
import { EventForm } from "./EventForm";

export const DNDEventModalForm = ({ slotStart, slotEnd, show, setShow }: {
    slotStart?: Date,
    slotEnd?: Date,
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    return (
        <>
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
                        New Event
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EventForm setShow={setShow} slotStart={slotStart} slotEnd={slotEnd} />
                </Modal.Body>
            </Modal>
        </>
    );
}
