import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(email, password);
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

            <button type='submit'>Login</button>
        </form>
    )
};

export default Login;