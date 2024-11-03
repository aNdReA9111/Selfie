import { RRule, Weekday } from "rrule";
// import { Frequency } from "./types";

export const italianTranslations: Record<string, string> = {
  and: "e",
  or: "o",
  every: "ogni",
  day: "giorno",
  week: "settimana",
  month: "mese",
  year: "anno",
  on: "il",
  until: "fino al",
  for: "per",
  at: "alle",
  times: "volte",
  Monday: "lunedì",
  Tuesday: "martedì",
  Wednesday: "mercoledì",
  Thursday: "giovedì",
  Friday: "venerdì",
  Saturday: "sabato",
  Sunday: "domenica",
  January: "gennaio",
  February: "febbraio",
  March: "marzo",
  April: "aprile",
  May: "maggio",
  June: "giugno",
  July: "luglio",
  August: "agosto",
  September: "settembre",
  October: "ottobre",
  November: "novembre",
  December: "dicembre",
};

export const weekDaysMap: Record<string, Weekday> = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU,
};

export const reverseWeekDaysMap = [
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
  "SU",
]

export const frequenciesMap: Record<string, number> = {
  DAILY: RRule.DAILY,
  WEEKLY: RRule.WEEKLY,
  MONTHLY: RRule.MONTHLY,
  YEARLY: RRule.YEARLY,
};

export const revereseFrequenciesMap: Record<number, string> = {
  [RRule.DAILY]: "DAILY",
  [RRule.WEEKLY]: "WEEKLY",
  [RRule.MONTHLY]: "MONTHLY",
  [RRule.YEARLY]: "YEARLY",
}
