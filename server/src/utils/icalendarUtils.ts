import ical, { ICalEventData, ICalRepeatingOptions } from "ical-generator";
import * as pkg from "rrule";
import { IActivity } from "../models/activityModel.js";
import { IEvent } from "../models/eventModel.js";
import { frequencyToICalEventRepeatingFreq, rRuleWeekdayIntToICalWeekday } from "./types.js";

const { RRule } = pkg;
// Funzione per generare un calendario iCal con un array di eventi
function createICalendar(events: IEvent[], activities: IActivity[]): string {
    const calendar = ical({ name: "Selfie Calendar" });

    events.forEach((event: IEvent) => {
        const rrule = RRule.fromString(event.recurrenceRule || "");

        /*rrule infos*/
        const repeating: ICalRepeatingOptions = {
            freq: frequencyToICalEventRepeatingFreq[rrule.options.freq],
            interval: rrule.options.interval,
            count: typeof rrule.options.count === "number" ? rrule.options.count : undefined,
            until: rrule.options.until ? rrule.options.until as Date : undefined,
            byDay: Array.isArray(rrule.options.byweekday) ?
                rrule.options.byweekday.map(d => rRuleWeekdayIntToICalWeekday[d])
                : rRuleWeekdayIntToICalWeekday[rrule.options.byweekday],
            byMonth: rrule.options.bymonth,
            byMonthDay: rrule.options.bymonthday,
            bySetPos: rrule.options.bysetpos,
        }

        const icalEvent: ICalEventData = {
            start: event.date,
            end: event.endDate,
            summary: event.title,
            description: event.description,
            location: event.location,
            url: event.url || "",
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
                key: "DUE",
                value: activity.date.toISOString(),
            }
        ]);
    });

    // Converti il calendario in formato iCalendar (.ics)
    return calendar.toString();
}

export { createICalendar };
