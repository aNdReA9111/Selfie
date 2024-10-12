import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { config } from 'dotenv';
config();

const MyNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  // const { events } = useEvents();
  const { user } = useContext(AuthContext);

  const check = () => {
    if(!('serviceWorker' in navigator))
      throw new Error("Service Worker non supportato");
    if(!('PushManager' in window))
      throw new Error("No support per Push API");
  }
  
  const askNotificationPermission = () => {
    if (permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }
  };

  async function subscribeUserToPush(registration: any) {
    const applicationServerKey = urlB64ToUint8Array(process.env.PUBLIC_VAPID_KEY as string);
  
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      console.log('User subscribed to push notifications:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe the user:', error);
    }

  }

// Helper to convert VAPID key
  function urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }
  
  useEffect(() => {
    const enablePushNotifications = async () => {
      if(user && user.flags.notifica_desktop && permission !== 'granted') {
        check();
        const reg = await navigator.serviceWorker.register("/sw.js");
        askNotificationPermission();
        if (permission !== 'granted') {
          throw new Error('No support for push notifications');
        }
        const subscription = await subscribeUserToPush(reg);
        fetch('http://localhost:4000/api/users/subscribe', {
          body: JSON.stringify(subscription),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }).then(response => {
          console.log(response);
          //aggiornare auth context con la sua sub
        }).catch(error => {
          console.error(error);
        })
      }
    }
    enablePushNotifications();
  }, [user]);

  return null;
};

export default MyNotification;
