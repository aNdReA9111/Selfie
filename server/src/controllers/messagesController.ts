import { MessageModel, IMessage } from "../models/messageModel.js";
import { Request, Response } from "express";
import { UserModel, IUser } from "../models/userModel.js";

// getMessages
export const getMessages = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user: IUser | null = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const messages: IMessage[] = await MessageModel.find({ 
            $or: [{ to: user.username }, { from: user.username }] 
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// sendMessage
export const sendMessage = async (req: Request, res: Response) => {
    const { sender_id } = req.params;
    const { text, to } = req.body;

    try {
        const sender: IUser | null = await UserModel.findById(sender_id);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const receiver: IUser | null = await UserModel.findOne({ username: to });
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        const newMessage: IMessage = await MessageModel.create({
            text,
            datetime: new Date(),
            from: sender.username,
            to: receiver.username
        });

        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};