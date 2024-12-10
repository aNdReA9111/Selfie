import { Chat } from '../components/Chat';
import { useAuthContext } from '../hooks/useAuthContext';


function Home() {
    const { user } = useAuthContext();

    // console.log(user);
    // console.log(document.cookie);
    return (
        <>
            <p>Ciao Home</p>
            <Chat />
        </>
    );

}


export default Home;
