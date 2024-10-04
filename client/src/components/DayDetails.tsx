import React, { useState } from 'react';
import { Form, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';

interface Event {
    id: number;
    time: string;
    description: string;
}

interface DayDetailsProps {
    selectedDay: string;
    events: Event[];
}

const DayDetails: React.FC<DayDetailsProps> = ({ selectedDay, events }) => {
    const [newEvent, setNewEvent] = useState({ time: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        /*
            ...
        */
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="my-4">Schedule for {selectedDay}</h2>
                    <ListGroup>
                        {events.map(event => (
                            <ListGroup.Item key={event.id}>
                                <span style={{ fontWeight: 'bold' }}>{event.time}</span>: {event.description}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Button variant="primary" type="submit" className="mt-3">
                        Add Event
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default DayDetails;