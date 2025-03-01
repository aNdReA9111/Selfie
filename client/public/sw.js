//service worker for push notifications
self.addEventListener("push", (event) => {
    console.log("Push event received:", event);
    const data = event.data.json();

    // Customize the notification
    const options = {
        body: data.body,
        icon: "/logo.png",
        requireInteraction: true,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options),
    );
});
