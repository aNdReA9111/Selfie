import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface UserProfileEditProps {
    onSubmit?: (userData: any) => void;
}

const UserInfo: React.FC<UserProfileEditProps> = ({ onSubmit = () => {} }) => {
    const { dispatch, user } = useAuthContext();
    
    const [nome, setNome] = useState<string>('');
    const [cognome, setCognome] = useState<string>('');
    const [dataNascita, setDataNascita] = useState<Date>(new Date());
    const [flags, setFlags] = useState({
        notifica_email: false,
        notifica_desktop: false
    });

    useEffect(() => {
        if (user) {
            setNome(user.nome);
            setCognome(user.cognome);
            setDataNascita(new Date(user.data_nascita));
            setFlags(user.flags || {
                notifica_email: false,
                notifica_desktop: false
            });
        }
    }, [user]);

    const isValidNameInput = (input: string): boolean => {
        return /^[A-Za-zÀ-ÿ\s']*$/.test(input);
    };

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isValidNameInput(value)) {
            setNome(value);
        }
    };

    const handleCognomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isValidNameInput(value)) {
            setCognome(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const updatedUser = {
                nome,
                cognome,
                data_nascita: dataNascita,
                flags: {
                    ...user.flags,
                    notifica_email: flags.notifica_email,
                    notifica_desktop: flags.notifica_desktop
                }
            };

            const response = await fetch('/api/users/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ 
                    type: 'UPDATE', 
                    payload: {
                        ...user,
                        ...updatedUser
                    }
                });
                onSubmit(data);
                alert('User updated successfully');
            }
        } catch (error) {
            console.error('Errore:', error);
        }
    };

    if (!user) return null;

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '800px' }}>
                <Card>
                    <Card.Header>
                        <h2 className="text-center mb-0">User Profile</h2>
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-4">
                            <Col>
                                <h6>Email:</h6>
                                <p>{user.email}</p>
                            </Col>
                            <Col>
                                <h6>Username:</h6>
                                <p>{user.username}</p>
                            </Col>
                        </Row>

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={nome}
                                            onChange={handleNomeChange}
                                            required
                                            pattern="[A-Za-zÀ-ÿ\s']*"
                                            title="Only letters, spaces and apostrophes are allowed."
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={cognome}
                                            onChange={handleCognomeChange}
                                            required
                                            pattern="[A-Za-zÀ-ÿ\s']*"
                                            title="Only letters, spaces and apostrophes are allowed."
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Date of birth</Form.Label>
                                <DatePicker
                                    selected={dataNascita}
                                    onChange={(date: Date | null) => date && setDataNascita(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                />
                            </Form.Group>

                            <Row className="mt-4">
                                <Col>
                                    <h6>Notifications:</h6>
                                    <Form.Check 
                                        type="switch"
                                        id="email-switch"
                                        label="Notifiche Email"
                                        checked={flags.notifica_email}
                                        onChange={(e) => setFlags(prev => ({
                                            ...prev,
                                            notifica_email: e.target.checked
                                        }))}
                                        className="mb-2"
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="desktop-switch"
                                        label="Notifiche Desktop"
                                        checked={flags.notifica_desktop}
                                        onChange={(e) => setFlags(prev => ({
                                            ...prev,
                                            notifica_desktop: e.target.checked
                                        }))}
                                        className="mb-2"
                                    />
                                </Col>
                            </Row>

                            <div className="text-center">
                                <Button variant="primary" type="submit" className="mt-3">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default UserInfo;