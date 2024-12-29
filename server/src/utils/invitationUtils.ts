import mongoose from "mongoose";
import { IActivity } from "../models/activityModel.js";
import { IAttendee, IEvent } from "../models/eventModel.js";
import { UserModel } from "../models/userModel.js";

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
    attendees?.forEach((attendee: IAttendee) => {
        /* code to send email to attendee.email with activity information*/
    })
}

export function sendEventInvitationEmail(sender: mongoose.Types.ObjectId, event: IEvent, attendees: IAttendee[]) {
    attendees?.forEach((attendee: IAttendee) => {
        /* code to send email to attendee.email with event information*/
    })
}

/* function that checks if user is already in the database */
export async function checkUser(username: string): Promise<boolean> {
    const user = await UserModel.findOne({ username });
    return user ? true : false;
}
