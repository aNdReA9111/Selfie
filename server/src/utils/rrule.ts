import { IEvent } from "../models/eventModel.js";
import { datetime, Frequency, RRule, RRuleSet, rrulestr, Weekday } from "rrule";

const getRRuleWeekday = (weekDays: string[] | undefined): Weekday[] => {
  if (!weekDays) return [RRule.MO];
  return weekDays.map((weekDay: string) => {
    switch (weekDay) {
      case "MO":
        return RRule.MO;
      case "TU":
        return RRule.TU;
      case "WE":
        return RRule.WE;
      case "TH":
        return RRule.TH;
      case "FR":
        return RRule.FR;
      case "SA":
        return RRule.SA;
      case "SU":
        return RRule.SU;
      default:
        return RRule.MO;
    }
  });
};

const getRRuleFrequency = (frequency: string): Frequency => {
  switch (frequency) {
    case "DAILY":
      return RRule.DAILY;
    case "WEEKLY":
      return RRule.WEEKLY;
    case "MONTHLY":
      return RRule.MONTHLY;
    case "YEARLY":
      return RRule.YEARLY;
    default:
      return RRule.DAILY;
  }
};

export const getAllOccurrences = (event: IEvent): IEvent[] => {
  if (event.recurrencyRule.isRecurring) {
    return [event];
  } else {
    const rule = new RRule({
      freq: getRRuleFrequency(event.recurrencyRule.frequency || "DAILY"),
      interval: event.recurrencyRule.interval,
      dtstart: new Date(event.date),
      until: event.recurrencyRule.endDate ? new Date(event.recurrencyRule.endDate) : null,
      byweekday: getRRuleWeekday(event.recurrencyRule.byday),
      bymonthday: event.recurrencyRule.bymonthday || null,
      count: event.recurrencyRule.repetition || null,
    });

    const rruleSet: RRuleSet = new RRuleSet();
    rruleSet.rrule(rule);
    //aggiunta prima data poiché non viene di default considerata come un'occorrenza
    rruleSet.rdate(datetime(event.date.getUTCFullYear(), event.date.getUTCMonth(), event.date.getUTCDate() + 1, event.date.getUTCHours(), event.date.getUTCMinutes(), event.date.getUTCSeconds()));

    //dato un evento con ripetizioni ritorno un array di copie dell'evento per ogni occorrenza
    return rruleSet
      .all()
      .slice(0, 100)
      .map((date: Date) => {
        const newEvent: IEvent = { ...event } as IEvent;
        newEvent.occurenceDate = new Date(date);
        return newEvent;
      });
  }
};
