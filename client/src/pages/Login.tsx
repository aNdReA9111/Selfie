import { useState } from 'react';
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await login(email, password);
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
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="auth-button"
                        >
                            Accedi
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
