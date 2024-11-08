import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    text: string;
    datetime: Date;
    from: string;
    to: string;
}

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
});

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);