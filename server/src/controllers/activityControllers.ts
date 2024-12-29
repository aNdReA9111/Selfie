import { Response } from "express";
import mongoose from "mongoose";
import { ActivityModel, IActivity } from "../models/activityModel.js";
import { IAttendee } from "../models/eventModel.js";
import { IUser, UserModel } from "../models/userModel.js";
import { changeActivitiesDate } from "../utils/activityUtils.js";
import { sendActivityInvitationEmail, setEmails } from "../utils/invitationUtils.js";
import { Req } from "../utils/types.js";

const createActivity = async (req: Req, res: Response) => {
    const { title, description, date, attendees, notifications, timezone, user: userId } = req.body;

    try {
        const validAttendees = await setEmails(attendees);
        console.log(validAttendees);
        const activity: IActivity = await ActivityModel.create({
            title,
            description,
            date,
            attendees: validAttendees,
            notifications,
            isCompleted: false,
            _id_user: userId,
            timezone
        });

        sendActivityInvitationEmail(userId, activity, activity.attendees || []);

        res.status(201).json(activity);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const getActivities = async (req: Req, res: Response) => {
    const userId: mongoose.Types.ObjectId = req.body.user;
    const date: string | undefined = req.query.date ? req.query.date.toString() : undefined;

    const user = await UserModel.findOne({ _id: userId }).select("email dateOffset");
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        /*change dates for late activities*/
        await changeActivitiesDate(userId.toString(), user.email, user.dateOffset);
        let activities: IActivity[];

        if (!date) {
            activities = await ActivityModel.find({
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
        } else {
            activities = await ActivityModel.find({
                $and: [
                    {
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
                    },
                    {
                        date: {
                            $gte: new Date((new Date(date)).setHours(0, 0, 0, 0)),
                            $lte: new Date((new Date(date)).setHours(23, 59, 59, 999)),
                        }
                    }
                ]
            });
        }

        res.status(200).json(activities);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getActivityById = async (req: Req, res: Response) => {
    const activityId = req.params.id;
    const userId: mongoose.Types.ObjectId = req.body.user;

    const user: IUser | null = await UserModel.findOne({ _id: userId }).select("email");
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


    let newAttendees: IAttendee[] = [];
    if ("attendees" in activityData) {
        const activity: IActivity | null = await ActivityModel.findOne({ _id: activityId }).select("attendees");

        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }

        for (const newAttendee of activityData.attendees) {
            let isNew: boolean = true;
            for (const attendee of activity.attendees || []) {
                if (newAttendee.name === attendee.name)
                    isNew = false
            }
            if (isNew)
                newAttendees.push(newAttendee);
        }
    }

    try {
        const newValidAttendees = await setEmails(newAttendees);

        const newActivity: IActivity | null = await ActivityModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(activityId), _id_user: userId.toString() },
            { ...activityData },
            { new: true },
        );

        if (!newActivity)
            res.status(404).json({ message: "Activity doesn't exist" })
        else
            sendActivityInvitationEmail(userId, newActivity as IActivity, newValidAttendees);

        res.status(200).json(newActivity);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export { createActivity, deleteActivities, deleteActivityById, getActivities, getActivityById, updateActivity };

