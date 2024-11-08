import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSignup } from '../hooks/useSignup';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/auth.css';

const Signup = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Le password non coincidono");
            return;
        }
        await signup({ username, email, firstName, lastName, password, birthDate, desktopNotifications: true, browserNotifications: true, emailNotifications: true });
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-left">
                    <img src={logo} alt="Selfie" />
                </div>
                <div className="auth-right">
                    <h1 className="auth-title">Crea Account</h1>
                    <p className="auth-subtitle">Unisciti a Selfie</p>
                    
                    <Form className="auth-form" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Control
                                    type="text"
                                    placeholder="Nome"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <Form.Control
                                    type="text"
                                    placeholder="Cognome"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Form.Control
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />

                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Form.Control
                            type="password"
                            placeholder="Conferma Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="auth-button"
                        >
                            Registrati
                        </Button>
                        
                        {error && <div className="auth-error">{error}</div>}

                        <div className="auth-links">
                            <span>Hai già un account?</span>
                            <Link to="/login">Accedi</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
};

export default Signup;