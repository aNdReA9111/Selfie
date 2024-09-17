import { useAuthContext } from "./useAuthContext";


export const useLogout = () =>{
    const { dispatch } = useAuthContext();

    const logout = () => {
        // rimuovo lo user dallo storage
        localStorage.removeItem('user');

        dispatch({type: "LOGOUT"});
    }

    return logout;

}