import { ICalEventData, default as icalExport } from "ical-generator";
import mongoose from "mongoose";
import { Attendee, default as icalImport, VEvent } from "node-ical";
import pkg from "rrule";
import { ActivityModel, IActivity } from "../models/activityModel.js";
import { EventModel, IEvent } from "../models/eventModel.js";
import {
    frequencyToICalEventRepeatingFreq,
    ImportedCalendar,
    rRuleWeekdayIntToICalWeekday,
} from "./types.js";

const { RRule } = pkg;

type RealAttendee = Exclude<Attendee, string>;

type CustomVEvent = VEvent & {
    DUE?: Date;
    COMPLETED: boolean;
    url: any;
};

/* creation of ics file content, exporting activities and events in Selfie calendar */
function createICalendar(events: IEvent[], activities: IActivity[]): string {
    const calendar = icalExport({ name: "Selfie Calendar" });

    /* exporting events */
    events.forEach((event: IEvent) => {
        let rrule = undefined;
        let repeating = undefined;

        /*rrule infos*/
        if (event.recurrenceRule && event.isRecurring) {
            rrule = RRule.fromString(event.recurrenceRule);
            repeating = {
                freq: frequencyToICalEventRepeatingFreq[rrule.options.freq],
                interval: rrule.options.interval,
                count:
                    typeof rrule.options.count === "number"
                        ? rrule.options.count
                        : undefined,
                until: rrule.options.until ? (rrule.options.until as Date) : undefined,
                byDay: Array.isArray(rrule.options.byweekday)
                    ? rrule.options.byweekday.map((d) => rRuleWeekdayIntToICalWeekday[d])
                    : rRuleWeekdayIntToICalWeekday[rrule.options.byweekday],
                byMonth: rrule.options.bymonth,
                byMonthDay: rrule.options.bymonthday.length
                    ? rrule.options.bymonthday
                    : undefined,
                bySetPos: rrule.options.bysetpos,
            };
        }

        const icalEvent: ICalEventData = {
            start: event.date,
            end: event.endDate,
            summary: event.title,
            description: event.description,
            location: event.location,
            url: event.url,
            attendees: event.attendees?.map((attendee) => ({
                name: attendee.name,
                email: attendee.email,
                rsvp: attendee.responded,
                partstat: attendee.accepted ? "ACCEPTED" : "DECLINED",
            })),
            timezone: event.timezone,
            repeating,
        };

        calendar.createEvent(icalEvent);
    });

    /*exporting activities as VEVENT with only start date, with a completed custom flag*/
    activities.forEach((activity: IActivity) => {
        calendar
            .createEvent({
                start: activity.date,
                summary: activity.title,
                description: activity.description,
                attendees: activity.attendees?.map((attendee) => ({
                    name: attendee.name,
                    email: attendee.email,
                    rsvp: attendee.responded,
                    partstat: attendee.accepted ? "ACCEPTED" : "DECLINED",
                })),
                timezone: activity.timezone,
            })
            .x([
                {
                    key: "X-COMPLETED",
                    value: activity.isCompleted.toString(),
                },
            ])
            .x([
                {
                    key: "X-DUE",
                    value: activity.date.toISOString(),
                },
            ]);
    });

    /*converting content to string so it can be placed inside the .ics file*/
    return calendar.toString();
}

async function readICalendar(
    icalData: string,
    userId: mongoose.Types.ObjectId,
): Promise<ImportedCalendar> {
    /*file parsing*/
    const events = icalImport.parseICS(icalData);
    let successCount = 0;
    let errorCount = 0;
    let createdEvents: IEvent[] = [];
    let createdActivities: IActivity[] = [];

    console.log(events.length);
    for (let key in events) {
        const event: CustomVEvent = events[key] as CustomVEvent;
        if (event.type === "VEVENT") {
            try {
                console.log("BROOO");
                /* attendees handling */
                const icsAttendees = Array.isArray(event.attendee)
                    ? (event.attendee as RealAttendee[])
                    : [event.attendee as RealAttendee];

                /* TODO: check esistenza utenti nel db (eventi di gruppo)*/
                const attendees = icsAttendees
                    .filter((attendee) => attendee)
                    .map((attendee: RealAttendee) => ({
                        name: attendee.params?.CN || "",
                        email: attendee.val.slice(7), // remove the "mailto:" prefix
                        responded: attendee.params?.RSVP,
                        accepted: attendee.params?.PARTSTAT === "ACCEPTED" ? true : false,
                    }));

                if (event.DUE == undefined) {
                    /*DUE is undefined --> event*/
                    const createdEvent: IEvent = await EventModel.create({
                        title: event.summary || "Evento senza titolo",
                        description: event.description || "",
                        date: event.start,
                        endDate: event.end || new Date(event.start.getTime() + 3600000),
                        location: event.location,
                        url: event.url?.val,
                        duration: event.end.getTime() - event.start.getTime(),
                        isRecurring:
                            event.rrule && event.rrule.toString().length > 0 ? true : false,
                        timezone:
                            event.start.tz ||
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                        _id_user: userId,
                        attendees,
                        recurrenceRule: event.rrule?.toString(),
                        isPomodoro: false,
                    });
                    createdEvents.push(createdEvent);
                } else {
                    /*DUE is defined --> activity*/
                    const createdActivity: IActivity = await ActivityModel.create({
                        title: event.summary || "Activity without title",
                        description: event.description || "  ",
                        date: event.DUE,
                        timezone:
                            event.start?.tz ||
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                        _id_user: userId,
                        attendees,
                        isCompleted: event.COMPLETED || false,
                    });
                    createdActivities.push(createdActivity);
                }

                successCount++;
            } catch (err) {
                console.error(
                    `Error while importing: ${event.summary}`,
                    err,
                );
                errorCount++;
            }
        }
    }

    return { events: createdEvents, activities: createdActivities };
}

export { createICalendar, readICalendar };
