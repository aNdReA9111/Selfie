import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';

const MyNotification = () => {
    const { user } = useContext(AuthContext);

    const check = () => {
        if (!('serviceWorker' in navigator))
            throw new Error("Service Worker non supportato");
        if (!('PushManager' in window))
            throw new Error("No support per Push API");
    }

    const askNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'default' || permission === 'denied') {
            throw new Error('No support for push notifications');
        }
        return permission;
    };

    async function subscribeUserToPush(registration: any) {
        const applicationServerKey = urlB64ToUint8Array(process.env.VAPID_PUBLIC_KEY as string);
        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });
            return subscription;
        } catch (error) {
            throw new Error('Failed to subscribe the user: ' + error);
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
            if (user && user.flags.notifica_desktop && Notification.permission !== 'granted') {
                check();
                const reg = await navigator.serviceWorker.register("/sw.js");
                const permission = await askNotificationPermission();
                if (permission === 'granted') {
                    const subscription = await subscribeUserToPush(reg);
                    if (subscription) {
                        const res = await fetch('/api/users/subscribe', {
                            body: JSON.stringify({ subscription }),
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                credentials: "include",
                            }
                        })
                        console.log(res);
                    }
                }
            }
        }
        enablePushNotifications();
    }, []);

    return null;
};

export default MyNotification;
