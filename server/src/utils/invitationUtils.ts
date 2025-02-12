import mongoose from "mongoose";
import { IActivity } from "../models/activityModel.js";
import { IAttendee, IEvent } from "../models/eventModel.js";
import { UserModel } from "../models/userModel.js";
import { sendEmail } from "./emailUtils.js";

// configuro il .env
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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
    
    attendees?.forEach((attendee: IAttendee) => {
        /* code to send email to attendee.email with activity information*/
        const email_text: string = `Invitation to Activity

        You have been invited to participate in the activity "${activity.title}".
        Please check this link for accept or decline the invitation: ${process.env.BASE_URL}/activities/${activity._id}/attendees/${attendee.name}

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

    attendees?.forEach((attendee: IAttendee) => {
        /* code to send email to attendee.email with event information*/
        const email_text: string = `Invitation to Event

        You have been invited to participate in the event "${event.title}".
        Please check this link for accept or decline the invitation: ${process.env.BASE_URL}/events/${event._id}/attendees/${attendee.name}

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
