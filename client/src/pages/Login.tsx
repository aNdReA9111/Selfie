import { useState } from 'react';
import { useLogin } from '../hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, isLoading} = useLogin();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await login(email, password);
    }
        
    return (
        <form className='login' onSubmit={ handleSubmit }>
            <h3>Login</h3>

            <label htmlFor="email">Email</label>
            <input  
                type="email" 
                id="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />

            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type='submit' disabled={isLoading}>Login</button>
            {error && <div className='error'>{error}</div>}
        </form>
    )
};

export default Login;