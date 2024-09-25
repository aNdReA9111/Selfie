import { useEffect, useState, useContext } from 'react';
import { useEvents } from '../hooks/useEvents';
import { AuthContext } from '../context/authContext';

import { diffDateFromNow } from '../utils/dateUtils';


const MyNotification = () => {
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
            if(diffDateFromNow(event.data, 'Europe/Rome', event.timezone) <= 0){
              showNotification(`Scaduto: ${event.titolo}`, {
                body: `${event.descrizione}`,
                icon: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ficons%2Falert&psig=AOvVaw3KC7Eg244OcU46PqoSh1kV&ust=1727039051808000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqGAoTCIDjgf331IgDFQAAAAAdAAAAABDNAQ'
              });

              // qui va la cancellazione dell'evento dal DB
            }
          });
        }
      }
    }, [events]);

    return null;
};

export default MyNotification;