
//per ora notifica semplice (quelle del calendario)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  const data = event.data.json();
  console.log(data.message);

  // Customize the notification
  // const options = {
  //   body: data.body,
  //   icon: '/logo.png',  // You can specify your app's logo
  // };
  //
  event.waitUntil(
    // self.registration.showNotification(data.title, options)
    self.registration.showNotification(data.message)
  );
});

