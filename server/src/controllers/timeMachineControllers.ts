import { Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/userModel.js";
import { Req } from "../utils/types.js";

export const setOffset = async (req: Req, res: Response) => {
    const userId: mongoose.Types.ObjectId = req.body.user;

    const dateOffset = req.body.offset;

    try {
        const user = await UserModel.findByIdAndUpdate(userId, { dateOffset });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }

    res.status(200).json({ dateOffset });
};

export const getOffset = async (req: Req, res: Response) => {
    const userId: mongoose.Types.ObjectId = req.body.user;

    try {
        const user = await UserModel.findById(userId).select("dateOffset");
        if (!user) {
            throw Error("user doesn't exist")
        }
        res.status(200).json({ dateOffset: user.dateOffset });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }

};
