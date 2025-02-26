import { Response } from "express";
import mongoose from "mongoose";
import { ActivityModel } from "../models/activityModel.js";
import { EventModel } from "../models/eventModel.js";
import { Req } from "../utils/types.js";

const acceptEventInvitation = async (req: Req, res: Response) => {
    const eventId = req.params.id;
    const { user: userId, attendeeName, responded, accepted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: "Invalid Event Id" });
    }

    try {
        await EventModel.updateOne(

            // $elemMatch finds docs containing an array with a matching element
            {
                _id: new mongoose.Types.ObjectId(eventId),
                "attendees": { "$elemMatch": { "name": attendeeName } }
            },

            // Positional operator $ is a placeholder for the first matching array element
            {
                "$set": { "attendees.$.responded": responded, "attendees.$.accepted": accepted }
            }
        );

        res.status(200).json("Accepted invitation successfully!");
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const acceptActivityInvitation = async (req: Req, res: Response) => {
    const activityId = req.params.id;
    const { user: userId, attendeeName, responded, accepted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ error: "Invalid Event Id" });
    }

    try {
        await ActivityModel.updateOne(

            // $elemMatch finds docs containing an array with a matching element
            {
                _id: new mongoose.Types.ObjectId(activityId),
                "attendees": { "$elemMatch": { "name": attendeeName } }
            },

            // Positional operator $ is a placeholder for the first matching array element
            {
                "$set": { "attendees.$.responded": responded, "attendees.$.accepted": accepted }
            }
        );

        res.status(200).json("Accepted invitation successfully!");
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export { acceptActivityInvitation, acceptEventInvitation };
