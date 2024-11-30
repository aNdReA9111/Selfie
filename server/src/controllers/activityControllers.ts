import { Response } from "express";
import mongoose from "mongoose";
import { ActivityModel, IActivity } from "../models/activityModel.js";
import { IUser, UserModel } from "../models/userModel.js";
import { changeActivitiesDate } from "../utils/activityUtils.js";
import { Req } from "../utils/types.js";

const createActivity = async (req: Req, res: Response) => {
    const { title, description, date, attendees, notifications, timezone, user: userId } = req.body;

    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const activity: IActivity = await ActivityModel.create({
            title,
            description,
            date,
            attendees,
            notifications,
            isCompleted: false,
            _id_user: userId,
            timezone
        });

        res.status(201).json(activity);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const getActivities = async (req: Req, res: Response) => {
    const userId: mongoose.Types.ObjectId = req.body.user;

    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        /*change dates for late activities*/
        await changeActivitiesDate(userId.toString(), user.email, user.dateOffset);

        const activities = await ActivityModel.find({
            $or: [
                { _id_user: userId.toString() },
                {
                    attendees: {
                        $elemMatch: {
                            email: user.email,
                            responded: true,
                            accepted: true,
                        },
                    },
                },
            ],
        });

        res.status(200).json(activities);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getActivityById = async (req: Req, res: Response) => {
    const activityId = req.params.id;
    const userId: mongoose.Types.ObjectId = req.body.user;

    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ error: "Invalid Activity Id" });
    }

    try {
        const activity: IActivity | null = await ActivityModel.findOne({
            _id: new mongoose.Types.ObjectId(activityId),
            $or: [
                { _id_user: userId.toString() },
                {
                    attendees: {
                        $elemMatch: {
                            email: user.email,
                            accepted: true,
                        },
                    },
                },
            ],
        });

        res.status(200).json(activity);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const deleteActivityById = async (req: Req, res: Response) => {
    const activityId = req.params.id;
    const userId: mongoose.Types.ObjectId = req.body.user;

    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ error: "Invalid Activity Id" });
    }

    try {
        const activity: IActivity | null = await ActivityModel.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(activityId),
            _id_user: userId.toString(),
        });
        res.status(200).json(activity);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const deleteActivities = async (req: Req, res: Response) => {
    const userId: mongoose.Types.ObjectId = req.body.user;

    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const result: mongoose.mongo.DeleteResult = await ActivityModel.deleteMany({
            _id_user: userId.toString(),
        });

        if (result.deletedCount === 0) {
            throw new Error("Impossibile to delete all activities");
        }

        res.status(200).json({ message: "All activities deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const updateActivity = async (req: Req, res: Response) => {
    const activityId = req.params.id;
    const { user: userId, ...activityData } = req.body;

    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ error: "Invalid Activity Id" });
    }

    try {
        const activity: IActivity | null = await ActivityModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(activityId), _id_user: userId.toString() },
            { ...activityData },
            { new: true },
        );
        res.status(200).json(activity);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export { createActivity, deleteActivities, deleteActivityById, getActivities, getActivityById, updateActivity };

