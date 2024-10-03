import mongoose, { Schema, Document, Model, set } from "mongoose";
import { Interface } from "readline";

// Definire un'interfaccia che rappresenta le proprietà di un documento Event

//interfaccia per eventi ricorrenti ispirata a rrule di ICalendar
interface IRRule {
  isRecurring: boolean;
  frequency?: string;
  repetition?: number;
  interval: number;
  byday?: string[];
  bymonthday?: number[];
  end?: string;
  endDate?: Date;
}

interface INotification {
  notifica_email: boolean;
  notifica_desktop: boolean;
  notifica_alert: boolean;
  text: string;
}

interface IAttendee {
  name: string;
  email: string;
  responded: boolean;
  accepted: boolean;
}

interface IEvent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location?: string;
  url?: string;
  duration: number;
  recurrencyRule: IRRule;
  attendees?: IAttendee[];
  notifications: INotification[];
  occurenceDate?: Date;
  _id_user: string;
}

const rruleSchema = new Schema<IRRule>({
  isRecurring: {
    type: Boolean,
    required: true,
  },
  frequency: {
    type: String,
    enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    required: function () {
      return this.isRecurring;
    },
  },
  interval: { type: Number, default: 1 },
  end: {
    type: String,
    enum: ["date", "forever", "repetitions"],
    required: function () {
      return this.isRecurring;
    },
  },
  byday: { type: [String], enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] },
  bymonthday: { type: [Number], min: 1, max: 31 },  
  repetition: {
    type: Number,
    required: function () {
      return this.end === "repetitions";
    },
  },
  endDate: {
    type: Date,
    required: function () {
      return this.end === "date";
    },
  },
});

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
    type: rruleSchema,
    required: true,
  },
  attendees: {
    type: [attendeeSchema],
    required: false,
  },
  notifications: {
    type: [notificationSchema],
    required: true,
  },
  occurenceDate: {
    type: Date,
    required: false,
  },
  _id_user: {
    type: String,
    required: true,
  },
});

const EventModel: Model<IEvent> = mongoose.model<IEvent>("event", eventSchema);

export { IEvent, EventModel };
