//per ora notifica semplice (quelle del calendario)
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  const data = event.data.json();

  // Customize the notification
  // const options = {
  //   body: data.body,
  //   icon: '/logo.png',  // You can specify your app's logo
  // };
  //
  event.waitUntil(
    // self.registration.showNotification(data.title, options)
    self.registration.showNotification(data.body),
  );
});

// // DA RIVEDERE , importante per pomodoro
// self.addEventListener("notificationclick", function (event) {
//   console.log("Notification click received");
//   event.notification.close();
//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(
//     clients
//       .matchAll({
//         type: "window",
//         includeUncontrolled: true,
//       })
//       .then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url === "/" && "focus" in client) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow("/");
//         }
//       }),
//   );
// });
