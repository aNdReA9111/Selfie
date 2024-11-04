// import webpush, { PushSubscription } from "web-push";
// import { EventModel, IEvent, INotification } from "../models/eventModel.js";
// import { UserModel, IUser } from "../models/userModel.js";
//
// const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
//
// //Invio notifica push
// function sendNotification(
//   sub: PushSubscription,
//   title: string,
//   url: string,
//   notifica_desktop: boolean,
//   notifica_mail: boolean,
//   priority: number,
// ) {
//   //priority serve per cambiare il testo in base alla priorità della notifica
//
//   console.log(`Sending notification: ${title}`);
//   if (notifica_desktop)
//     webpush
//       .sendNotification(
//         sub,
//         JSON.stringify({ title, body: "Ricordati dell'evento!", url }),
//       )
//       .then(() => console.log(`Notification sent: ${title}`))
//       .catch((error) => console.error(`Error sending notification: ${error}`));
//
//   // if(notifica_desktop)
//   //CODICE PER INVIO EMAIL
// }
//
// // Controllo ed eventuale invio di notifiche
// async function checkAndSendNotifications() {
//   //utenti che possono ricevere le notifiche
//   const users: IUser[] = await UserModel.find({
//     $or: [
//       { notifications: { $exists: true } },
//       { "flags.notifica_desktop": true },
//       { "flags.notifica_email": true },
//     ],
//   }).lean();
//
//   //ora
//   const now: number = Date.now();
//
//   for (const user of users) {
//     const timeMachineDate: number = now + user.dateOffset;
//     // const fiveDaysMs = MILLIS_IN_DAY * 5;
//     try {
//       let events: IEvent[] | null = await EventModel.find({
//         $and: [
//           {
//             $or: [
//               { "notifications.notifica_desktop": true },
//               { "notifications.notifica_email": true },
//             ],
//           },
//           {
//             $or: [
//               { _id_user: user._id },
//               {
//                 attendees: {
//                   $elemMatch: {
//                     email: user.email,
//                     accepted: true,
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//         $or: [
//           { date: { $gte: new Date(timeMachineDate) } },
//           { nextDate: { $gte: new Date(timeMachineDate) } },
//         ],
//       }).lean(); //lean ritorna direttamente oggetti js/ts invece di docs mongoose
//
//       for (const event of events) {
//         const eventDate: number = event.isRecurring
//           ? event.nextDate?.getTime() || 0
//           : event.date.getTime();
//         const notifications: INotification | undefined = event.notifications;
//
//         // associo le notifiche al rispettivo momento d'invio
//         const notificationTimes = calculateNotificationTimes(
//           eventDate,
//           notifications as INotification,
//           event.title,
//           event.url || "",
//         );
//
//         for (const {
//           title,
//           url,
//           notificationTime,
//           priority,
//         } of notificationTimes) {
//           //primo controllo --> si attivano solo notifiche del giorno stesso
//           if (
//             // (user.dateOffset !== 0 && new Date(notificationTime).getDate() === new Date(now + user.dateOffset).getDate()) && //per time machine solo notifiche dello stesso giorno
//             notificationTime <= now + user.dateOffset && //passata
//             notificationTime > now + user.dateOffset - 60000 //passata da massimo un minuto
//           ) {
//             user.pushSubscriptions.forEach((sub: PushSubscription) => {
//               sendNotification(
//                 sub,
//                 title,
//                 url,
//                 user.flags.notifica_desktop &&
//                   (event.notifications?.notifica_desktop || false),
//                 user.flags.notifica_email &&
//                   (event.notifications?.notifica_email || false),
//                 priority,
//               );
//             });
//           } else {
//             console.log(`Skipping notification: ${title}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
//
// // calcolo date notifiche
// function calculateNotificationTimes(
//   eventDate: number,
//   notifications: INotification,
//   title: string,
//   url: string,
// ) {
//   const times = [];
//   const { advance, advanceType, repetitions, frequency, frequencyType } =
//     notifications;
//
//   // Convert advance time to milliseconds
//   let advanceMs = 0;
//   if (advance) {
//     switch (advanceType) {
//       case "DAYS":
//         advanceMs = (advance || 0) * MILLIS_IN_DAY;
//         break;
//       case "HOURS":
//         advanceMs = (advance || 0) * 1000 * 60 * 60;
//         break;
//       case "MINUTES":
//         advanceMs = (advance || 0) * 1000 * 60;
//         break;
//       default:
//         break;
//     }
//   }
//
//   const initialNotificationTime: number = eventDate - advanceMs;
//
//   for (let i = 0; i < (repetitions || 1); i++) {
//     let notificationTime: number = initialNotificationTime;
//
//     switch (frequencyType) {
//       case "MINUTELY":
//         notificationTime += i * (frequency || 1) * 1000 * 60; // Add frequency in minutes
//         break;
//       case "HOURLY":
//         notificationTime += i * (frequency || 1) * 1000 * 60 * 60; // Add frequency in hours
//         break;
//       case "DAILY":
//         notificationTime += i * (frequency || 1) * MILLIS_IN_DAY; // Add frequency in days
//         break;
//       default:
//         break;
//     }
//
//     times.push({
//       title,
//       url,
//       notificationTime,
//       priority: i + 1,
//     });
//   }
//
//   return times;
// }
//
// //Demone per invio notifiche
// export function startDaemon() {
//   setInterval(async () => {
//     await checkAndSendNotifications();
//   }, 60000);
// }
import webpush, { PushSubscription } from "web-push";
import { EventModel, IEvent, INotification } from "../models/eventModel.js";
import { UserModel, IUser } from "../models/userModel.js";

const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

//Invio notifica push
function sendNotification(
  sub: PushSubscription,
  title: string,
  url: string,
  notifica_desktop: boolean,
  notifica_mail: boolean,
  priority: number,
) {
  //priority serve per cambiare il testo in base alla priorità della notifica

  console.log(`Sending notification: ${title}`);
  if (notifica_desktop)
    webpush
      .sendNotification(
        sub,
        JSON.stringify({ title, body: "Ricordati dell'evento!", url }),
      )
      .then(() => console.log(`Notification sent: ${title}`))
      .catch((error) => console.error(`Error sending notification: ${error}`));

  // if(notifica_desktop)
  //CODICE PER INVIO EMAIL
}

// Controllo ed eventuale invio di notifiche
async function checkAndSendNotifications() {
  //utenti che possono ricevere le notifiche
  const users: IUser[] = await UserModel.find({
    $or: [
      { notifications: { $exists: true } },
      { "flags.notifica_desktop": true },
      { "flags.notifica_email": true },
    ],
  }).lean();

  //ora
  const now: number = Date.now();

  for (const user of users) {
    const timeMachineDate: number = now + (user.dateOffset || 0);
    // const fiveDaysMs = MILLIS_IN_DAY * 5;
    try {
      let events: IEvent[] | null = await EventModel.find({
        $and: [
          {
            $or: [
              { "notifications.notifica_desktop": true },
              { "notifications.notifica_email": true },
            ],
          },
          {
            $or: [
              { _id_user: user._id },
              {
                attendees: {
                  $elemMatch: {
                    email: user.email,
                    accepted: true,
                  },
                },
              },
            ],
          },
        ],
        $or: [
          { date: { $gte: new Date(timeMachineDate) } },
          {
            $and: [
              { nextDate: { $exists: true } },
              { nextDate: { $gte: new Date(timeMachineDate) } },
            ],
          },
        ],
      }).lean(); //lean ritorna direttamente oggetti js/ts invece di docs mongoose

      console.log(events);

      for (const event of events) {
        const eventDate: number = event.isRecurring
          ? event.nextDate?.getTime() || 0
          : event.date.getTime();
        const notifications: INotification | undefined = event.notifications;

        // associo le notifiche al rispettivo momento d'invio
        const notificationTimes = calculateNotificationTimes(
          eventDate,
          notifications as INotification,
          event.title,
          event.url || "",
        );

        for (const {
          title,
          url,
          notificationTime,
          priority,
        } of notificationTimes) {
          //primo controllo --> si attivano solo notifiche del giorno stesso
          console.log(now + (user.dateOffset || 0 ) - notificationTime);
          if (
            // (user.dateOffset !== 0 &&
            // new Date(notificationTime).getDate() ===
            //   new Date(now + (user.dateOffset || 0)).getDate()) && //per time machine solo notifiche dello stesso giorno
            notificationTime <= now + (user.dateOffset || 0 ) && //passata
            notificationTime > now + (user.dateOffset || 0) - 60000 //passata da massimo un minuto
          ) {
            user.pushSubscriptions.forEach((sub: PushSubscription) => {
              sendNotification(
                sub,
                title,
                url,
                user.flags.notifica_desktop &&
                  (event.notifications?.notifica_desktop || false),
                user.flags.notifica_email &&
                  (event.notifications?.notifica_email || false),
                priority,
              );
            });
          } else {
            console.log(`Skipping notification: ${title}`);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// calcolo date notifiche
function calculateNotificationTimes(
  eventDate: number,
  notifications: INotification,
  title: string,
  url: string,
) {
  const times = [];
  const { advance, advanceType, repetitions, frequency, frequencyType } =
    notifications;

  // Convert advance time to milliseconds
  let advanceMs = 0;
  if (advance) {
    switch (advanceType) {
      case "DAYS":
        advanceMs = (advance || 0) * MILLIS_IN_DAY;
        break;
      case "HOURS":
        advanceMs = (advance || 0) * 1000 * 60 * 60;
        break;
      case "MINUTES":
        advanceMs = (advance || 0) * 1000 * 60;
        break;
      default:
        break;
    }
  }

  const initialNotificationTime: number = eventDate - advanceMs;

  for (let i = 0; i < (repetitions || 1); i++) {
    let notificationTime: number = initialNotificationTime;

    switch (frequencyType) {
      case "MINUTELY":
        notificationTime += i * (frequency || 1) * 1000 * 60; // Add frequency in minutes
        break;
      case "HOURLY":
        notificationTime += i * (frequency || 1) * 1000 * 60 * 60; // Add frequency in hours
        break;
      case "DAILY":
        notificationTime += i * (frequency || 1) * MILLIS_IN_DAY; // Add frequency in days
        break;
      default:
        break;
    }

    times.push({
      title,
      url,
      notificationTime,
      priority: i + 1,
    });
  }

  return times;
}

//Demone per invio notifiche
export function startDaemon() {
  setInterval(async () => {
    await checkAndSendNotifications();
  }, 60000);
}
