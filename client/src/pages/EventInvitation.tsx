import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';

const EventInvitation: React.FC = () => {
    const { idEvent, nameAttendee } = useParams();
    const [showResponse, setShowResponse] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (response: boolean) => {
        try {
            await fetch(`/api/invitations/event/${idEvent}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify( {
                    attendeeName: nameAttendee, responded: true, accepted: response
                })
            });

            setAccepted(response);
            setShowResponse(true);
            setError(null);
        } catch (err) {
            setError('An error occurred while processing your response.');
            console.error(err);
        }
    };

    if (showResponse) {
        return (
            <Container className="mt-5 text-center">
                {accepted ? (
                    <Alert variant="success">
                        <CheckCircle className="me-2" size={24} />
                        Thank you for accepting the invitation!
                    </Alert>
                ) : (
                    <Alert variant="info">
                        <XCircle className="me-2" size={24} />
                        We're sorry you can't make it.
                    </Alert>
                )}
                <Link to="/" className="btn btn-primary mt-3">
                    Return to Home Page
                </Link>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Event Invitation</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="d-flex flex-column align-items-center">
                <p className="mb-4">Would you like to join this event?</p>
                <div className="d-flex gap-3">
                    <Button 
                        variant="success" 
                        onClick={() => handleSubmit(true)}
                    >
                        Accept
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => handleSubmit(false)}
                    >
                        Decline
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EventInvitation;