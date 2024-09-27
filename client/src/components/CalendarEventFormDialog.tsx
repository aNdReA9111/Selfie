import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface CalendarEventFormDialogProps {
    show: boolean;
    handleClose: () => void;
    date: string;
}

const CalendarEventFormDialog: React.FC<CalendarEventFormDialogProps> = ({ show, handleClose, date }) => {
    const [time, setTime] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const dateTime = `${date}T${time}`;
        console.log('Combined DateTime:', dateTime);
        handleClose();
    };

    return (
        <Modal show={show}>
            <Modal.Header>
                <Modal.Title>Set Event Time</Modal.Title>
                <Button variant="secondary" onClick={handleClose}>
                    X
                </Button>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTime">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    </Form.Group>


                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Chiudi
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CalendarEventFormDialog;