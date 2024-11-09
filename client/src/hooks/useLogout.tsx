import { useAuthContext } from "./useAuthContext";


export const useLogout = () =>{
    const { dispatch } = useAuthContext();

    const logout = async () => {
        // post alla route logout del server
        await fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include'
        });

        dispatch({type: "LOGOUT"});
    }

    return logout;
}