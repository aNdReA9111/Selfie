import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage extends Document {
        _id: Schema.Types.ObjectId;
        text: string;
    datetime: Date;
        from: string;
          to: string;
}

const messageSchema: Schema = new Schema<IMessage>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    text: { type: String, required: true },
    datetime: { type: Date, required: true },
    from: { type: String, required: true, match: /^[a-zA-Z0-9]{2,16}$/ },
    to: { type: String, required: true, match: /^[a-zA-Z0-9]{2,16}$/ },
});

const MessageModel: Model<IMessage> = mongoose.model<IMessage>("message", messageSchema);

export { MessageModel, IMessage };
