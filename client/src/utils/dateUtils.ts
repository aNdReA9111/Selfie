// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
//
//
// import { IEvent } from '../hooks/useEvents';
//
// // Estendere Day.js con i plugin UTC e timezone
// dayjs.extend(utc);
// dayjs.extend(timezone);
//
// // Impostare il timezone locale
// dayjs.tz.setDefault('Europe/Rome');
//
// export const formatDate = (date: Date) => {
//   return dayjs(date).format("DD-MM-YYYY");
// };
//
// export const formatTime = (date: Date) => {
//   return dayjs(date).format("HH:mm");
// };
//
// export const formatDateTime = (date: Date) => {
//   return dayjs(date).format("DD-MM-YYYY HH:mm");
// };
//
// export const formatDateToStandard = (date: Date) => {
//   return dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ[Z]');
// }
//
// export const diffDateFromNow = (date: Date, timezone_date : string, timezone_local: string ) => {
//   return dayjs(date).tz(timezone_date).diff(dayjs().tz(timezone_local), 'seconds');
// }
//
//
// export const sortEventsByNearest = (events: IEvent[]) => {
//   return events.sort((a, b) => {
//     return dayjs(a.data).diff(b.data);
//   });
// }
//
// export const insertOrdered = (events: IEvent[], event: IEvent) => {
//   let i = 0;
//   
//   while (i++ < events.length && dayjs(event.data).diff(events[i].data) > 0);
//   
//   events.splice(i, 0, event);
// }
//
// export const parseReminder = (reminder: string, date: Date) => {
//   const regex = /^([1-9]+[mhdMy])$/;
//   if (!regex.test(reminder))
//     throw new Error("Il campo reminder deve essere nel formato [1-9][m,h,d,M,y]");
//   
//   let unit_toString: dayjs.ManipulateType = "minutes"; // default value
//   const unit = reminder[reminder.length - 1];
//   const value = parseInt(reminder.slice(0, -1));
//   let stringa_reminder : string = value + " ";
//
//   switch (unit) {
//     case 'm':
//       stringa_reminder += "minuti";
//       unit_toString = "minutes"
//       break;
//     case 'h':
//       stringa_reminder += "ore";
//       unit_toString = "hours"
//       break;
//     case 'd':
//       stringa_reminder += "giorni";
//       unit_toString = "days"
//       break;
//     case 'M':
//       stringa_reminder += "mesi";
//       unit_toString = "months"
//       break;
//     case 'y':
//       stringa_reminder += "anni";
//       unit_toString = "years"
//       break;
//   }
//
//   let data_reminder = formatDateToStandard(dayjs(date).subtract(value, unit_toString).toDate());
//
//   return { data_reminder, stringa_reminder };
// }
//
//
// // testa le funzioni
// console.log(parseReminder('1d', new Date()));
