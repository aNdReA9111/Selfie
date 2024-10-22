import { z } from "zod";

//custom types for time machine context
export type TimeMachineState = {
  offset: number;
};

export type TimeMachineAction =
  | {
      type: "SET_OFFSET";
      payload: number;
    }
  | {
      type: "RESET_OFFSET";
    };

export type TimeMachineContextType = {
  offset: number;
  dispatch: React.Dispatch<TimeMachineAction>;
};

//custom types for notes context
export const noteSchema = z.object({
  _id: z.number().positive().optional(),
  author: z.string().min(2).max(30),
  title: z.string().min(2).max(50),
  content: z.string(),
  created: z.date(),
  updated: z.date(),
  open: z.boolean(),
  allowedUsers: z
    .union([
      z.string().transform((str) => str.split(",").map((s) => s.trim())),
      z.array(z.string()),
    ])
    .optional(),
  tags: z
    .union([
      z.string().transform((str) => str.split(",").map((s) => s.trim())),
      z.array(z.string()),
    ])
    .optional(),
});

export const formSchema = noteSchema.pick({
  title: true,
  content: true,
  open: true,
  allowedUsers: true,
  tags: true,
});

//creazione tipi ts dall'oggetto zod
export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = z.infer<typeof formSchema>;
export type NotesState = {
  notes: Note[];
};
// export type NotesDispatch = React.Dispatch<NotesAction>;
export type NotesAction =
  | {
      type: "SET_NOTES";
      payload: Note[];
    }
  | {
      type: "CREATE_NOTE";
      payload: Note;
    }
  | {
      type: "DELETE_ONE";
      payload: number;
    }
  | {
      type: "DELETE_ALL";
    }
  | {
      type: "EDIT_NOTE";
      payload: Note;
    }
  | {
      type: "SORT_BY_DATE";
    }
  | {
      type: "SORT_BY_TITLE";
    }
  | {
      type: "SORT_BY_CONTENT";
    };
export type NotesContextType = {
  notes: Note[];
  dispatch: React.Dispatch<NotesAction>;
};

//calendar validation schemas
const createNumberFormString = (max: number) => {
  return z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val; // If it's already a number, return it
  }, z.number().int().min(1).max(max).default(1));
}

const createSetPosNumberFormString = () => {
  return z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);  //cpnversione in base 10
      if(parsed === 0) return undefined; //set pos indica l'occorrenza, zeresima occorrenza non ha senso
      return isNaN(parsed) ? undefined : parsed;
    }
    return val; // If it's already a number, return it
  }, z.number().int().min(-1).max(4).default(1));
}

const dateFromString = z.preprocess((val) => {
  if (typeof val === 'string') {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return val; // If it's already a number, return it
}, z.date());

const freqEnum = z.enum([
  "DAILY", "WEEKLY", "MONTHLY", "YEARLY"
]);

const byDayEnum = z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
const byMonthEnum = z.array(createNumberFormString(12)).optional(); // 1-12 for months
const byMonthDay = z.array(createNumberFormString(31)).optional(); // -31 to 31
const byWeekNo = z.array(createNumberFormString(53)).optional(); // -53 to 53
const bySetPos = z.array(createSetPosNumberFormString()).optional();

// Recurrence Rule Schema
const rruleSchema = z.object({
  frequency: freqEnum, // Mandatory frequency
  interval: createNumberFormString(50).optional(), // Optional, defaults to 1
  until: dateFromString.optional(), // Optional, must be a valid date string
  count: createNumberFormString(200).optional(), // Optional, specifies the number of occurrences
  byday: z.array(byDayEnum).optional(), // Optional array of days of the week
  bymonthday: byMonthDay, 
  bymonth: byMonthEnum,
  byweekno: byWeekNo,
  bysetpos: bySetPos,
});

//attendee schema
const attendeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  accepted: z.boolean().optional(),
  responded: z.boolean().optional(),
});

const notificationAdvanceEnum = z.enum(["DAYS", "HOURS", "MINUTES"]);
const notificationsFrequencyEnum = z.enum(["MINUTELY", "HOURLY", "DAILY"]);

//notifications schema
const notificationsSchema = z.object({
  notifica_email: z.boolean(),
  notifica_desktop: z.boolean(),
  notifica_alert: z.boolean(),
  text: z.string().min(1, "Text is required"), // Ensure text is a non-empty string
  before: z.boolean().optional(),
  advance: createNumberFormString(5).optional(),
  repetitions: z.number().optional(),
  frequency: createNumberFormString(5).optional(),
  frequencyType: notificationsFrequencyEnum.optional(),
  advanceType: notificationAdvanceEnum.optional(),
});

export const eventSchema = z.object({
  _id: z.number().positive().optional(),
  title: z.string().min(2).max(30),
  description: z.string().min(2).max(150),
  date: z.date(),
  endDate: z.date(),
  duration: z.number().positive().optional(),
  nextDate: z.date().optional(),
  location: z.string().optional(),
  url: z.string().url().optional(),
  recurrencyRule: z.union([z.string(), rruleSchema]),
  attendees: z.array(attendeeSchema).optional(),
  notifications: notificationsSchema.optional(),
  isRecurring: z.boolean(),
});

export const eventFormSchema = eventSchema.pick({
  title: true,
  description: true,
  date: true,
  endDate: true,
  location: true,
  url: true,
  recurrencyRule: true,
  attendees: true,
  notifications: true,
  isRecurring: true,
});

export type Event = z.infer<typeof eventSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>;
