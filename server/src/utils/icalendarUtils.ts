import ical, { ICalEventData } from "ical-generator";
import pkg from "rrule";
import { IActivity } from "../models/activityModel.js";
import { IEvent } from "../models/eventModel.js";
import { frequencyToICalEventRepeatingFreq, rRuleWeekdayIntToICalWeekday } from "./types.js";

const { RRule } = pkg;

/* creation of ics file content, exporting activities and events in Selfie calendar */
function createICalendar(events: IEvent[], activities: IActivity[]): string {
    const calendar = ical({ name: "Selfie Calendar" });

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
                count: typeof rrule.options.count === "number" ? rrule.options.count : undefined,
                until: rrule.options.until ? rrule.options.until as Date : undefined,
                byDay: Array.isArray(rrule.options.byweekday) ?
                    rrule.options.byweekday.map(d => rRuleWeekdayIntToICalWeekday[d])
                    : rRuleWeekdayIntToICalWeekday[rrule.options.byweekday],
                byMonth: rrule.options.bymonth,
                byMonthDay: rrule.options.bymonthday.length ? rrule.options.bymonthday : undefined,
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
        calendar.createEvent({
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
        }).x([
            {
                key: "X-COMPLETED",
                value: activity.isCompleted.toString(),
            }
        ]).x([
            {
                key: "X-DUE",
                value: activity.date.toISOString(),
            }
        ]);
    });

    /*converting content to string so it can be placed inside the .ics file*/
    return calendar.toString();
}

function readCalendar() {

}

export { createICalendar };
