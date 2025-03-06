import React, { useState } from 'react';
import { Container, Alert, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const EventInvitation: React.FC = () => {
    const { idEvent, nameAttendee } = useParams();
    const [showResponse, setShowResponse] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (response: boolean) => {
        try {
            const res = await fetch(`/api/invitations/event/${idEvent}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    attendeeName: nameAttendee,
                    responded: true,
                    accepted: response,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                // Mostra l'errore restituito dal backend
                setError(data.error || 'An error occurred while processing your response.');
                return;
            }
            
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
            <Container className="mt-5 text-center p-4">
                {accepted ? (
                    <Alert variant="success">
                        Thank you for accepting the event invitation!
                    </Alert>
                ) : (
                    <Alert variant="warning">
                        You have declined the event invitation.
                    </Alert>
                )}

                {/* Add a button to redirect to the home page */}
                <Button variant="primary" href="/">Go to Home</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5 p-4">
            <h2 className="text-center mb-4">Event Invitation</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="d-flex flex-column align-items-center">
                <div className="mb-3">
                    <Button variant="success" onClick={() => handleSubmit(true)}>
                        Accept Invitation
                    </Button>
                </div>
                <div>
                    <Button variant="danger" onClick={() => handleSubmit(false)}>
                        Decline Invitation
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EventInvitation;