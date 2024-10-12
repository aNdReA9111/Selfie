
//per ora notifica semplice (quelle del calendario)
self.addEventListener('push', (event: any) => {
  const data = event.data.json();

  // Customize the notification
  const options = {
    body: data.body,
    icon: '/logo.png',  // You can specify your app's logo
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

