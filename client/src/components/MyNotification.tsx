import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';

const MyNotification = () => {
    const { user } = useContext(AuthContext);

    const check = () => {
        if (!('serviceWorker' in navigator))
            throw new Error("Service Worker not supported");
        if (!('PushManager' in window))
            throw new Error("No support for Push API");
    }

    const askNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'default' || permission === 'denied') {
            throw new Error('No support for push notifications');
        }
        return permission;
    };

    async function subscribeUserToPush(registration: any) {
        console.log(import.meta.env.VITE_VAPID_PUBLIC_KEY);
        try {
            const applicationServerKey = urlB64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY as string);
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
                        await fetch('/api/users/subscribe', {
                            body: JSON.stringify({ subscription }),
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                credentials: "include",
                            }
                        })
                    }
                }
            }
        }
        enablePushNotifications();
    }, []);

    return null;
};

export default MyNotification;
