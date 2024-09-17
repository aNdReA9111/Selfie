import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {signup, error, isLoading} = useSignup();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await signup(email, password);
    }
        
    return (
        <form className='signup' onSubmit={ handleSubmit }>
            <h3>Signup</h3>

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

            <button type='submit' disabled={isLoading}>Signup</button>  
            {error && <div className='error'>{error}</div>}
        </form>
    )
};

export default Signup;