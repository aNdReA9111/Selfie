import { Request } from "express";
import { ICalEventRepeatingFreq, ICalWeekday } from "ical-generator";
import pkg from 'rrule';
const { Frequency } = pkg;
import { IActivity } from "../models/activityModel.js";
import { IEvent } from "../models/eventModel.js";

//posso aggiungere user a req object senza errori statici di ts
export interface Req extends Request {
    user?: any;
}

export type ImportedCalendar = {
    events: IEvent[];
    activities: IActivity[];
};

export const frequencyToICalEventRepeatingFreq = {
    [Frequency.YEARLY]: ICalEventRepeatingFreq.YEARLY,
    [Frequency.MONTHLY]: ICalEventRepeatingFreq.MONTHLY,
    [Frequency.WEEKLY]: ICalEventRepeatingFreq.WEEKLY,
    [Frequency.DAILY]: ICalEventRepeatingFreq.DAILY,
    [Frequency.HOURLY]: ICalEventRepeatingFreq.HOURLY,
    [Frequency.MINUTELY]: ICalEventRepeatingFreq.MINUTELY,
    [Frequency.SECONDLY]: ICalEventRepeatingFreq.SECONDLY,
};

// Map ICalEventRepeatingFreq enum to Frequency enum
export const iCalEventRepeatingFreqToFrequency = {
    [ICalEventRepeatingFreq.SECONDLY]: Frequency.SECONDLY,
    [ICalEventRepeatingFreq.MINUTELY]: Frequency.MINUTELY,
    [ICalEventRepeatingFreq.HOURLY]: Frequency.HOURLY,
    [ICalEventRepeatingFreq.DAILY]: Frequency.DAILY,
    [ICalEventRepeatingFreq.WEEKLY]: Frequency.WEEKLY,
    [ICalEventRepeatingFreq.MONTHLY]: Frequency.MONTHLY,
    [ICalEventRepeatingFreq.YEARLY]: Frequency.YEARLY,
};

export const rRuleWeekdayIntToICalWeekday: Record<number, ICalWeekday> = {
    0: ICalWeekday.SU, // Sunday
    1: ICalWeekday.MO, // Monday
    2: ICalWeekday.TU, // Tuesday
    3: ICalWeekday.WE, // Wednesday
    4: ICalWeekday.TH, // Thursday
    5: ICalWeekday.FR, // Friday
    6: ICalWeekday.SA, // Saturday
};
