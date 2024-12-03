import { DateTime } from "luxon";

export function toUTC(date: Date, zone: string) {
    return DateTime.fromJSDate(date).setZone(zone, { keepLocalTime: true }).toUTC().toJSDate();
}
