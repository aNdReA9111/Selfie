import { useEffect, useState, useContext } from 'react';
import { useEvents } from '../hooks/useEvents';
import { AuthContext } from '../context/authContext';


function Home(){
    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
    const { events } = useEvents();
    const { user } = useContext(AuthContext);
  
    const showNotification = (title: string, options?: NotificationOptions) => {
      if (permission === 'granted') {
        new Notification(title, options);
      } else {
        console.warn('Notification permission not granted');
      }
    };
  
    const askNotificationPermission = () => {
      if (permission !== 'granted') {
        Notification.requestPermission().then((perm) => {
          setPermission(perm);
          if (perm === 'granted') {
            showNotification('Grazie per aver attivato le notifiche!');
          }
        });
      }
    };
  
    useEffect(() => {
      if(user && user.flags.notifica_desktop) {
        askNotificationPermission();
        if (permission === 'granted') {
          events.forEach((event) => {
            showNotification(`Evento: ${event.titolo}`, {
              body: `${event.descrizione}`,
              icon: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ficons%2Falert&psig=AOvVaw3KC7Eg244OcU46PqoSh1kV&ust=1727039051808000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqGAoTCIDjgf331IgDFQAAAAAdAAAAABDNAQ'
            });
          });
        }
      }
    }, [events]);

    return (
        <>
            <p>Ciao Home</p>        
        </>
    );

}


export default Home;