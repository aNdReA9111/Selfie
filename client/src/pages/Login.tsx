import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await login(email, password);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(to bottom, #6A0000, #FF0000)' }}>
            <h1 style={{ color: 'white', marginBottom: '10vh' }}>Selfie</h1>
            <Form className='mb-3' onSubmit={handleSubmit} style={{ width: '300px', padding: '20px', border: '1px solid red', borderRadius: '10px', backgroundColor: 'white' }}>
                <h3 style={{ textAlign: 'center'}}>Login</h3>

                <Form.Group controlId="formBasicEmail" className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isLoading} style={{ backgroundColor: 'red', borderColor: 'red', width: '100%' }}>
                    Login
                </Button>
                
                {error && <div className='error' style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    Non hai un account? <Link to="/signup" style={{ color: 'red' }}>Registrati</Link>
                </div>
            </Form>
        </div>
    )
};

export default Login;
