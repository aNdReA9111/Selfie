import mongoose, { Document, Model, Schema } from "mongoose";
import { attendeeSchema, IAttendee, INotification, notificationSchema } from "./eventModel.js";

/*activity interface*/
interface IActivity extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    date: Date;
    isCompleted: boolean;
    attendees?: IAttendee[];
    notifications?: INotification[];
    _id_user: string;
    timezone: string;
}

/*mongoose schema*/
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
    isCompleted: {
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
    timezone: {
        type: String,
        required: true
    }
});

const ActivityModel: Model<IActivity> = mongoose.model<IActivity>("activity", activitySchema);

export { ActivityModel, IActivity };

