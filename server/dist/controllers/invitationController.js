import mongoose from "mongoose";
import { ActivityModel } from "../models/activityModel.js";
import { EventModel } from "../models/eventModel.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
const getUserFromToken = async (token) => {
    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const user = await UserModel.findOne({ _id }).select("username");
        return user;
    }
    catch (error) {
        return null;
    }
};
const acceptEventInvitation = async (req, res) => {
    const eventId = req.params.id;
    const { attendeeName, responded, accepted } = req.body;
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Token not found. Access denied." });
    }
    const verify_user = await getUserFromToken(token);
    if (!verify_user) {
        return res.status(401).json({ error: "Token isn't valid." });
    }
    if (verify_user.username !== attendeeName) {
        return res.status(401).json({ error: "Not authorized: you are not the correct attendee for this event." });
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
    }
    try {
        await EventModel.updateOne({
            _id: new mongoose.Types.ObjectId(eventId),
            "attendees": { "$elemMatch": { "name": attendeeName } }
        }, {
            "$set": { "attendees.$.responded": responded, "attendees.$.accepted": accepted }
        });
        res.status(200).json("Invitation modified successfully!");
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const acceptActivityInvitation = async (req, res) => {
    const activityId = req.params.id;
    const { attendeeName, responded, accepted } = req.body;
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Token not found. Access denied." });
    }
    const verify_user = await getUserFromToken(token);
    if (!verify_user) {
        return res.status(401).json({ error: "." });
    }
    if (verify_user.username !== attendeeName) {
        return res.status(401).json({ error: "Not authorized: you are not the correct attendee for this activity." });
    }
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ error: "Invalid activity ID" });
    }
    try {
        await ActivityModel.updateOne({
            _id: new mongoose.Types.ObjectId(activityId),
            "attendees": { "$elemMatch": { "name": attendeeName } }
        }, {
            "$set": { "attendees.$.responded": responded, "attendees.$.accepted": accepted }
        });
        res.status(200).json("Invitation modified successfully!");
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export { acceptActivityInvitation, acceptEventInvitation };
//# sourceMappingURL=invitationController.js.map