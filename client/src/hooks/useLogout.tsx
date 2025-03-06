import { useAuthContext } from "./useAuthContext";
import { useNavigate } from 'react-router-dom';

export const useLogout = () =>{
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const logout = async () => {
        // post alla route logout del server
        await fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        navigate('/login?logout=true', { replace: true });
        dispatch({type: "LOGOUT"});
    }

    return logout;
}