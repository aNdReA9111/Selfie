import mongoose, { Schema, Document, Model } from "mongoose";

interface INotification {
  notifica_email: boolean;
  notifica_desktop: boolean;
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

interface IPomodoro{
  studioTime: number;
  riposoTime: number;
  nCicli: number;
  isComplete: boolean;
}

// Definire un'interfaccia che rappresenta le proprietà di un documento Event
interface IEvent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  location?: string;
  url?: string;
  duration: number;
  recurrenceRule: string;
  attendees?: IAttendee[];
  notifications?: INotification;
  isRecurring: boolean;
  // nextDate?: Date;
  _id_user: string;
  timezone: string;
  isPomodoro: boolean;
  pomodoroSetting: IPomodoro;
}

const notificationSchema = new Schema<INotification>({
  notifica_email: {
    type: Boolean,
    required: true,
  },
  notifica_desktop: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    // required: function (): boolean {
    //   return (
    //     false || this.notifica_desktop || this.notifica_email
    //   );
    // },
  },
  before: {
    type: Boolean,
    required: function () {
      return (
        this.notifica_desktop || this.notifica_email
      );
    },
  },
  advance: {
    type: Number,
    required: function () {
      return (
        this.notifica_desktop || this.notifica_email
      );
    },
  },
  advanceType: {
    type: String,
    enum: ["DAYS", "HOURS", "MINUTES"],
    required: function () {
      return (
        this.notifica_desktop || this.notifica_email
      );
    },
  },
  repetitions: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return (
        this.notifica_desktop || this.notifica_email
      );
    },
  },
  frequency: {
    type: Number,
    required: function () {
      return (
        this.notifica_desktop || this.notifica_email
      );
    },
  },
  frequencyType: {
    type: String,
    enum: ["MINUTELY", "HOURLY", "DAILY"],
    required: function () {
      return (
        this.notifica_desktop || this.notifica_email
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

const pomodoroSchema = new Schema<IPomodoro>({
  studioTime:{
    type: Number,
    require: true,
  },
  riposoTime:{
    type: Number,
    require: true,
  },
  nCicli:{
    type: Number,
    require: true,
  },
  isComplete:{
    type: Boolean,
    require:true,
  }
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
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  timezone: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: true,
  },
  recurrenceRule: {
    type: String,
    required: function () {
      return this.isRecurring;
    },
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
  // nextDate: {
  //   type: Date,
  //   // default: this.date,
  //   required: function () {
  //     this.isRecurring === true;
  //   },
  // },
  _id_user: {
    type: String,
    required: true,
  },
  isPomodoro: {
    type: Boolean,
    required: true,
  },
  pomodoroSetting:{
    type: pomodoroSchema,
    required: function(){
      return this.isPomodoro;
    },
  }
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