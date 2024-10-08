import mongoose, { Schema, Document, Model } from "mongoose";
import { IAttendee, attendeeSchema, INotification, notificationSchema } from "./eventModel.js";

// Definire un'interfaccia che rappresenta le proprietà di un documento Event
interface IActivity extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  isLate: boolean;
  attendees?: IAttendee[];
  notifications?: INotification[];
  _id_user: string;
}

// Definire lo schema di Mongoose
const activitySchema = new Schema<IActivity>({
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
    required: false,
  },
  isLate: {
    type: Boolean,
    required: true,
  },
  attendees: {
    type: [attendeeSchema],
    required: false,
  },  
  notifications: {
    type: [notificationSchema],
    required: false,
  },
  _id_user: {
    type: String,
    required: true,
  },
});

const ActivityModel: Model<IActivity> = mongoose.model<IActivity>("activity", activitySchema);

export { IActivity, ActivityModel };
