import mongoose, { Document, Model, Schema } from "mongoose";

interface INote extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    content: string;
    author: string;
    created: Date;
    updated: Date;
    open: boolean;
    allowedUsers?: string[];
    tags?: string[];
}

const noteSchema: Schema = new Schema<INote>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: {
        type: String,
        required: true,
        minlength: [2, "Title must be at least 2 characters long"],
        maxlength: [30, "Title must be at most 30 characters long"],
    },
    content: { type: String, required: true },
    author: {
        type: String,
        required: true,
        minlength: [2, "Author must be at least 2 characters long"],
        maxlength: [50, "Author must be at most 50 characters long"],
    },
    created: { type: Date, required: true },
    updated: { type: Date, required: true },
    open: { type: Boolean, required: true },
    allowedUsers: [String],
    tags: [String],
});

const NoteModel: Model<INote> = mongoose.model<INote>("note", noteSchema);

export { INote, NoteModel };

