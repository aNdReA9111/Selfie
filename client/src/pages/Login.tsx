import { useState, FormEvent } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from '../assets/logo.png';
import '../css/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validazione base
        if (!email || !password) {
            alert('Per favore, compila tutti i campi');
            return;
        }

        try {
            await login(email, password);
        } catch (err) {
            console.error('Errore durante il login:', err);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-left">
                    <img src={logo} alt="Selfie" />
                </div>
                <div className="auth-right">
                    <h1 className="auth-title">Bentornato</h1>
                    <p className="auth-subtitle">Accedi al tuo account Selfie</p>
                    
                    <Form className="auth-form" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </Form.Group>
                        
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="auth-button"
                        >
                            {isLoading ? 'Accesso in corso...' : 'Accedi'}
                        </Button>
                        
                        {error && <div className="auth-error">{error}</div>}

                        <div className="auth-links">
                            <span>Non hai un account?</span>
                            <Link to="/signup">Registrati</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
};

export default Login;
