import { DateTime } from "luxon";
import mongoose from "mongoose";
import pkg from "rrule";
import { IActivity } from "../models/activityModel.js";
import { EventModel, IAttendee, IEvent } from "../models/eventModel.js";
import { UserModel } from "../models/userModel.js";
import { sendEmail } from "./emailUtils.js";
const { RRule } = pkg;

// configuro il .env
import * as dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function checkDoNotDisturb(attendee: IAttendee): Promise<boolean> {

    const attendee_id = await UserModel.findOne({
        username: attendee.name,
    }).select("_id dateOffset");

    const now: DateTime = DateTime.now().plus(attendee_id?.dateOffset || 0);

    const doNotDisturbNonRec = await EventModel.find(
        {
            _id_user: attendee_id?._id,
            date: { $lte: now.toJSDate() },
            endDate: { $gte: now.toJSDate() },
            isRecurring: false,
            isDoNotDisturb: true
        },
    );

    console.log("hello", doNotDisturbNonRec);

    if (doNotDisturbNonRec.length > 0) {
        return true;
    }

    const doNotDisturbRec = await EventModel.find(
        {
            _id_user: attendee_id?._id,
            isRecurring: true,
            isDoNotDisturb: true
        },
    );

    for (const doNotDisturb of doNotDisturbRec) {
        const rrule = RRule.fromString(doNotDisturb.recurrenceRule);

        const dates: Date[] = rrule.all();
        for (const date of dates) {
            if (DateTime.fromJSDate(date) <= now && now <= DateTime.fromJSDate(date).plus(doNotDisturb.duration)) {
                return true;
            }
        }
    }

    return false;
}

/* function to set attendees' email (from input form we only get usernames) */
export async function setEmails(attendees: IAttendee[]): Promise<IAttendee[]> {
    let validAttendees: IAttendee[] = [];

    for (const attendee of attendees) {
        const email = await UserModel.findOne({ username: attendee.name }).select("email -_id");

        if (email?.email) {
            attendee.email = email.email;
            validAttendees.push(attendee);
        }
    }

    return validAttendees;
}

export function sendActivityInvitationEmail(sender: mongoose.Types.ObjectId, activity: IActivity, attendees: IAttendee[]) {

    // get user from DB
    const user_sender = UserModel.findById(sender);

    attendees?.forEach(async (attendee: IAttendee) => {
        const skip: boolean = await checkDoNotDisturb(attendee);
        if (skip)
            return;
        /* code to send email to attendee.email with activity information*/
        const email_text: string = `Invitation to Activity

        You have been invited to participate in the activity "${activity.title}".
        Please check this link in order to accept or decline the invitation: ${process.env.BASE_URL}/activities/${activity._id}/attendees/${attendee.name}

        Activity Details:
        - Title: ${activity.title}
        - Description: ${activity.description}
        - Date: ${activity.date}

        Best regards,
        Selfie Team`;

        sendEmail(attendee.email, "Invitation to Activity", email_text, []);
    })
}

export function sendEventInvitationEmail(sender: mongoose.Types.ObjectId, event: IEvent, attendees: IAttendee[]) {

    // get user from DB
    const user_sender = UserModel.findById(sender);
    const now: DateTime = DateTime.now();

    attendees?.forEach(async (attendee: IAttendee) => {
        const skip: boolean = await checkDoNotDisturb(attendee);
        if (skip)
            return;
        /* code to send email to attendee.email with event information*/
        const email_text: string = `Invitation to Event

        You have been invited to participate in the event "${event.title}".
        Please check this link in order to accept or decline the invitation: ${process.env.BASE_URL}/events/${event._id}/attendees/${attendee.name}

        Event Details:
        - Title: ${event.title}
        - Description: ${event.description}
        - Date: ${event.date}

        Best regards,
        Selfie Team`;

        sendEmail(attendee.email, "Invitation to Event", email_text, []);
    })
}

/* function that checks if user is already in the database */
export async function checkUser(username: string): Promise<boolean> {
    const user = await UserModel.findOne({ username });
    return user ? true : false;
}
