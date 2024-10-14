//function running to check moment for sending notifications
import webpush from "web-push";
import schedule from "node-schedule";
import { EventModel, IEvent } from "../models/eventModel.js";
import { UserModel, IUser } from "../models/userModel.js";

const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

function getMilllisecondsUntilMidnight() {
  const now = new Date();
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextDay.getTime() - now.getTime();
}

//TODO: schedulare notifiche
//TODO: interazione con time_machine, capire bene come collegare con altre routes + rescheduling
//TODO: notifiche mail
//TODO: controllo query

//esecuzione sempre a mezzanotte
setTimeout(() => {
  setInterval( async () => {
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
        $lt: new Date(new Date().setDate(new Date().getDate() + fiveDaysMs))
      },
      notifications: {
        $or: [
          {
            $elemMatch: {
              notifica_desktop: true,
            }
          },
          {
            $elemMatch: {
              notifica_email: true,
            }
          }
        ]
      }
    }); //da sistemare
    //prendo tutti gli utenti
    for (const event of events) {
      const users: IUser[] = [];
      //utenti proprietari di eventi che hanno acconsentito all'invio di notifiche
      const user: IUser | null = await UserModel.findOne({
        _id: event._id_user,
        flags: { 
          $or: [
            { 'flags.notifica_desktop': true }, 
            { 'flags.notifica_email': true } 
          ] 
        },
      });
      //utenti partecipanti di eventi che hanno acconsentito all'invio di notifiche
      const otherUsers: IUser[] | null = await UserModel.find({
        _id: { $in: event.attendees },
        flags: { 
          $or: [
            { 'flags.notifica_desktop': true }, 
            { 'flags.notifica_email': true } 
          ] 
        },
      });
      if(user)
        users.push(user);
      if(otherUsers)
        users.push(...otherUsers);
      eventToUserMap.set(event, users);
    }
    //qui ho tutti gli eventi e tutti gli utenti coinvolti
    //per ogni notifica, invio una notifica per ogni utente
    eventToUserMap.forEach(async (users: IUser[], event: IEvent) => {
      for (const user of users) {
        //notifica per email
        if (user.flags.notifica_desktop) {
          //notifica per email
          for (const sub of user.pushSubscriptions) {
            //QUI NON MANDO SUBITO, MA FACCIO SCHEDULING
            webpush.sendNotification(sub, JSON.stringify({
              title: "Selfie",
              body: event.title,
              url: event.url,
            }));
          }
        }
      }
    })
  }, MILLIS_IN_DAY);
}, getMilllisecondsUntilMidnight());
