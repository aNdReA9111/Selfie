import mongoose, { Schema, Document, Model } from "mongoose";

//interfaccia per eventi ricorrenti ispirata a rrule di ICalendar
// interface IRRule {
//   isRecurring: boolean;
//   frequency?: string;
//   repetition?: number;
//   interval: number;
//   byday?: string[];
//   bymonthday?: number[];
//   bymonth?: number[];
//   end?: string;
//   endDate?: Date;
// }

interface INotification {
  notifica_email: boolean;
  notifica_desktop: boolean;
  notifica_alert: boolean;
  text: string;
  before?: boolean; //true per eventi, false per attività con con data finale
  advance?: number; //quanto prima o dopo voglio la notifica
  repetitions?: number; //quante notifiche voglio ricevere
  frequency?: number; //con quale frequenza voglio ricevere le notifiche
  frequencyType?: string; //con quale frequenza voglio ricevere le notifiche
  advanceType?: string; //giorni, ore, minuti
}

interface IAttendee {
  name: string;
  email: string;
  responded: boolean;
  accepted: boolean;
}

// Definire un'interfaccia che rappresenta le proprietà di un documento Event
interface IEvent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location?: string;
  url?: string;
  duration: number;
  recurrencyRule: string;
  // recurrencyRule: IRRule;
  attendees?: IAttendee[];
  notifications?: INotification;
  isRecurring: boolean;
  nextDate?: Date;
  _id_user: string;
}

// const rruleSchema = new Schema<IRRule>({
//   isRecurring: {
//     type: Boolean,
//     required: true,
//   },
//   frequency: {
//     type: String,
//     enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
//     required: function () {
//       return this.isRecurring;
//     },
//   },
//   interval: { type: Number, default: 1 },
//   end: {
//     type: String,
//     enum: ["date", "forever", "repetitions"],
//     required: function () {
//       return this.isRecurring;
//     },
//   },
//   byday: {
//     type: [String],
//     enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
//     required: function () {
//       return this.frequency === "WEEKLY";
//     },
//   },
//   bymonthday: {
//     type: [Number],
//     min: 1,
//     max: 31,
//     required: function () {
//       return this.frequency === "MONTHLY" || this.frequency === "YEARLY";
//     },
//   },
//   bymonth: {
//     type: [Number],
//     min: 1,
//     max: 12,
//     required: function () {
//       return this.frequency === "YEARLY";
//     },
//   },
//   repetition: {
//     type: Number,
//     required: function () {
//       return this.end === "repetitions";
//     },
//   },
//   endDate: {
//     type: Date,
//     required: function () {
//       return this.end === "date";
//     },
//   },
// });

const notificationSchema = new Schema<INotification>({
  notifica_email: {
    type: Boolean,
    required: true,
  },
  notifica_desktop: {
    type: Boolean,
    required: true,
  },
  notifica_alert: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  before: {
    type: Boolean,
    required: function () {
      return (
        this.notifica_alert || this.notifica_desktop || this.notifica_email
      );
    },
  },
  advance: {
    type: Number,
    required: function () {
      return (
        this.notifica_alert || this.notifica_desktop || this.notifica_email
      );
    },
  },
  advanceType: {
    type: String,
    enum: ["DAYS", "HOURS", "MINUTES"],
    required: function () {
      return (
        this.notifica_alert || this.notifica_desktop || this.notifica_email
      );
    },
  },
  repetitions: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return (
        this.notifica_alert || this.notifica_desktop || this.notifica_email
      );
    },
  },
  frequency: {
    type: Number,
    required: function () {
      return (
        this.notifica_alert || this.notifica_desktop || this.notifica_email
      );
    },
  },
  frequencyType: {
    type: String,
    enum: ["MINUTELY", "HOURLY", "DAILY"],
    required: function () {
      return (
        this.notifica_alert || this.notifica_desktop || this.notifica_email
      );
    },
  },
});

const attendeeSchema = new Schema<IAttendee>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  responded: {
    type: Boolean,
    required: true,
  },
  accepted: {
    type: Boolean,
    required: true,
  },
});

// Definire lo schema di Mongoose
const eventSchema = new Schema<IEvent>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: true,
  },
  recurrencyRule: {
    type: String,
    required: true,
  },
  attendees: {
    type: [attendeeSchema],
    required: false,
  },
  notifications: {
    type: notificationSchema,
    required: false,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  nextDate: {
    type: Date,
    required: function() { this.isRecurring === true },
  },
  _id_user: {
    type: String,
    required: true,
  },
});

const EventModel: Model<IEvent> = mongoose.model<IEvent>("event", eventSchema);

export {
  IEvent,
  EventModel,
  IAttendee,
  attendeeSchema,
  INotification,
  notificationSchema,
};
