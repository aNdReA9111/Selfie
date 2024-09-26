import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useSignup } from '../hooks/useSignup';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [desktopNotifications, setDesktopNotifications] = useState<boolean>(false);
    const [browserNotifications, setBrowserNotifications] = useState<boolean>(false);
    const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        await signup({ username, email, firstName, lastName, password, birthDate, desktopNotifications, browserNotifications, emailNotifications });
    }

    return (
        <Form className='signup' onSubmit={handleSubmit}>
            <h3>Signup</h3>

            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="birthDate">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="desktopNotifications">
                <Form.Check
                    type="checkbox"
                    label="Desktop Notifications"
                    checked={desktopNotifications}
                    onChange={(e) => setDesktopNotifications(e.target.checked)}
                />
            </Form.Group>

            <Form.Group controlId="browserNotifications">
                <Form.Check
                    type="checkbox"
                    label="Browser Notifications"
                    checked={browserNotifications}
                    onChange={(e) => setBrowserNotifications(e.target.checked)}
                />
            </Form.Group>

            <Form.Group controlId="emailNotifications">
                <Form.Check
                    type="checkbox"
                    label="Email Notifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                />
            </Form.Group>

            <Button type='submit' disabled={isLoading}>Signup</Button>
            {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}
        </Form>
    )
};

export default Signup;