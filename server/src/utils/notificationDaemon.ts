//function running to check moment for sending notifications
import webpush, { PushSubscription } from "web-push";
import schedule, { Job } from "node-schedule";
import { EventModel, IEvent, INotification } from "../models/eventModel.js";
import { UserModel, IUser } from "../models/userModel.js";

//TODO: schedulare notifiche
//TODO: interazione con time_machine, capire bene come collegare con altre routes + rescheduling
//TODO: notifiche mail
//TODO: controllo query --> sistemata query per trovare glu users

const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

function toMonthDayByMonth(day: number, maxDay: number) {
  if (day > maxDay) return day - maxDay;
  return day;
}

//title, url dall'evento
function scheduleNotification(
  notifications: INotification,
  date: Date,
  sub: PushSubscription,
  title: string,
  url: string,
) {
  const {
    notifica_email,
    notifica_desktop,
    notifica_alert,
    before,
    text,
    advance,
    advanceType,
    repetitions,
    frequencyType,
    frequency,
  } = notifications;

  //1-31
  let monthDay = date.getDate();

  //0-23
  let hour = date.getHours();

  //0-59
  let minute = date.getMinutes();

  switch (advanceType) {
    case "DAYS":
      monthDay -= advance || 0;
      break;
    case "HOURS":
      hour -= advance || 0;
      break;
    case "MINUTES":
      minute -= advance || 0;
      break;
    default:
      break;
  }

  const rule = new schedule.RecurrenceRule();

  switch (frequencyType) {
    case "MINUTELY":
      let minuteRec = [];

      for (let i = 0; i < repetitions; i++) {
        minuteRec.push((minute + i * frequency) % 60);
      }

      rule.minute = minuteRec;
      break;

    case "HOURLY":
      let hourRec = [];

      for (let i = 0; i < repetitions; i++) {
        hourRec.push((hour + i * frequency) % 24);
      }

      rule.hour = hourRec;
      break;

    case "DAILY":
      let dayRec = [];
      const month = date.getMonth();
      const isLeapYear =
        (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) ||
        date.getFullYear() % 400 === 0;

      for (let i = 0; i < repetitions; i++) {
        let val = monthDay + i * frequency;
        if (month === 1 && isLeapYear) {
          dayRec.push(toMonthDayByMonth(val, 29));
        } else if (month === 1 && !isLeapYear) {
          dayRec.push(toMonthDayByMonth(val, 28));
        } else if (month === 3 || month === 5 || month === 8 || month === 10) {
          dayRec.push(toMonthDayByMonth(val, 30));
        } else {
          dayRec.push(toMonthDayByMonth(val, 31));
        }
      }

      rule.date = dayRec;
      break;

    default:
      break;
  }

  let count: number = 0;
  const job: Job = schedule.scheduleJob(rule, () => {
    webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "Selfie",
        body: title,
        url: url,
      }),
    );
  });
}

function getMilllisecondsUntilMidnight() {
  const now = new Date();
  const nextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  return nextDay.getTime() - now.getTime();
}

//esecuzione sempre a mezzanotte
setTimeout(() => {
  setInterval(async () => {
    const eventToUserMap = new Map<IEvent, IUser[]>();
    //check for today notifications
    //prendo gli eventi di oggi
    const fiveDaysMs = MILLIS_IN_DAY * 5;
    //le notifiche possono arrivare fino a 5 giotni prima
    //quindi prendo tutti gli eventi fino a 5 giorni prima da ora
    const events: IEvent[] | null = await EventModel.find({
      date: {
        //qui uso data corrente, ma sarà data time machine
        $gte: new Date(new Date().setDate(new Date().getDate() - fiveDaysMs)),
        $lt: new Date(new Date().setDate(new Date().getDate() + fiveDaysMs)),
      },
      notifications: {
        $or: [
          {
            $elemMatch: {
              notifica_desktop: true,
            },
          },
          {
            $elemMatch: {
              notifica_email: true,
            },
          },
        ],
      },
    }); //da sistemare
    //prendo tutti gli utenti
    for (const event of events) {
      //utenti proprietari di eventi che hanno acconsentito all'invio di notifiche
      //utenti partecipanti di eventi che hanno acconsentito all'invio di notifiche
      const users: IUser[] | null = await UserModel.find({
        $or: [{ _id: event._id_user }, { email: { $in: event.attendees } }],
        flags: {
          $or: [
            { "flags.notifica_desktop": true },
            { "flags.notifica_email": true },
          ],
        },
      });
      if (users) eventToUserMap.set(event, users);
    }
    //qui ho tutti gli eventi e tutti gli utenti coinvolti
    //per ogni notifica, invio una notifica per ogni utente
    eventToUserMap.forEach(async (users: IUser[], event: IEvent) => {
      for (const user of users) {
        if (user.flags.notifica_desktop) {
          for (const sub of user.pushSubscriptions) {
            scheduleNotification(
              event.notifications as INotification,
              event.date,
              sub,
              event.title,
              event.url as string,
            );
          }
        }
        // if (user.flags.notifica_email) {
          //notifica per email
          //email notification logic, not implemented yet
        // }
      }
    });
  }, MILLIS_IN_DAY);
}, getMilllisecondsUntilMidnight());
