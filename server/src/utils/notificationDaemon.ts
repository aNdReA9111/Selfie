import webpush, { PushSubscription } from "web-push";
import { EventModel, IEvent, INotification } from "../models/eventModel.js";
import { UserModel, IUser } from "../models/userModel.js";

const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

//Invio notifica
function sendNotification(sub: PushSubscription, title: string, url: string) {
  webpush
    .sendNotification(sub, JSON.stringify({ title, body: title, url }))
    .then(() => console.log(`Notification sent: ${title}`))
    .catch((error) => console.error(`Error sending notification: ${error}`));
}

// Controllo ed eventual invio di notifiche
async function checkAndSendNotifications() {
  //utenti che possono ricevere le notifiche
  const users = await UserModel.find({
    $or: [{ "flags.notifica_desktop": true }, { "flags.notifica_email": true }],
  });
  
  //ora
  const now: number = Date.now();

  for (const user of users) {
    const timeMachineDate = user.currentDate
      ? new Date(user.currentDate).getTime()
      : Date.now();
    const fiveDaysMs = MILLIS_IN_DAY * 5;

    const events: IEvent[] | null = await EventModel.find({
      notifications: {
        $or: [
          { $elemMatch: { notifica_desktop: true } },
          { $elemMatch: { notifica_email: true } },
        ],
      },
      $or: [{ _id_user: user._id }, { attendees: user.email }],
      date: {
        $gte: new Date(timeMachineDate - fiveDaysMs),
        $lt: new Date(timeMachineDate + fiveDaysMs),
      },
    });

    for (const event of events) {
      const eventDate: number = event.date.getTime();
      const notifications: INotification | undefined = event.notifications;

      // associo le notifiche al rispettivo momento d'invio
      const notificationTimes = calculateNotificationTimes(
        eventDate,
        notifications as INotification,
        timeMachineDate,
        event.title,
        event.url || "",
      );

      for (const { title, url, notificationTime } of notificationTimes) {
        if (notificationTime <= now) {
          user.pushSubscriptions.forEach((sub: PushSubscription) => {
            sendNotification(sub, title, url);
          });
        }
      }
    }
  }
}

// Calculate notification times in milliseconds based on the time machine date
function calculateNotificationTimes(
  eventDate: number,
  notifications: INotification,
  timeMachineDate: number,
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
  // const initialNotificationTime: number = timeMachineDate
  //   ? eventDate - advanceMs - (Date.now() - new Date(timeMachineDate).getTime())
  //   : eventDate - advanceMs;
  const initialNotificationTime: number = eventDate - advanceMs;

  // Generate notification times based on frequency settings
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
    });
  }

  return times;
}

//Demone per invio notifiche
async function startDaemon() {
  while (true) {
    await checkAndSendNotifications();

    //eseguo ogni minuto
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
}

//start del demone
startDaemon();
