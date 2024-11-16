import { z } from "zod";

//date-string preprocessing
const dateFromString = z.preprocess((val) => {
  if (typeof val === "string") {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return val; // If it's already a number, return it
}, z.date());

//date-string preprocessing, but optional
const dateFromStringOptional = z.preprocess((val) => {
  if (typeof val === "string") {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return val; // If it's already a number, return it
}, z.date().optional());


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

//note filters schema
export const noteFilterSchema = z.object({
  pub: z.boolean().optional(),
  group: z.boolean().optional(),
  priv: z.boolean().optional(),
  start: dateFromStringOptional,
  end: dateFromStringOptional,
  tags: z
    .union([
      z.string().transform((str) => str.split(",").map((s) => s.trim())),
      z.array(z.string()),
    ])
    .optional(),
}).refine((data) => {
    if (data.start && data.end) {
      return data.start.getTime() <= data.end.getTime();
    }
    else if (!data.start && !data.end) {
      return true;
    }
    else return false;
  },
  {
    message: "Start date must be before end date",
    path: ["start"],
  })
;

export type NoteFilterType = z.infer<typeof noteFilterSchema>;

//custom types for notes context
export const noteSchema = z.object({
  _id: z.string().optional(),
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

//infering types from zod objects
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
      payload: string;
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

//custom types for event context
//form data preprocessing --> all data from form are strings
const createNumberFromString = (max: number) => {
  return z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val; // If it's already a number, return it
  }, z.number().int().min(1).max(max));
};

const createSetPosNumberFromString = () => {
  return z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseInt(val, 10); //cpnversione in base 10
      if (parsed === 0) return undefined; //set pos indica l'occorrenza, zeresima occorrenza non ha senso
      return isNaN(parsed) ? undefined : parsed;
    }
    return val; // If it's already a number, return it
  }, z.number().int().min(-1).max(4));
};

const freqEnum = z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);
const byDayEnum = z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
export type ByDayEnum = z.infer<typeof byDayEnum>;
const byMonthEnum = z
  .array(createNumberFromString(12))
  .or(createNumberFromString(12))
  .optional()
  .nullable(); //12 for months
const byMonthDay = z
  .array(createNumberFromString(31))
  .or(createNumberFromString(31))
  .optional()
  .nullable(); //31 for month days
const bySetPos = z
  .array(createSetPosNumberFromString())
  .or(createSetPosNumberFromString())
  .optional()
  .nullable();

//Recurrence Rule Schema
const rruleSchema = z.object({
  frequency: freqEnum, // Mandatory frequency
  interval: createNumberFromString(50).optional().nullable(), // Optional, defaults to 1
  until: dateFromString.optional(), // Optional, must be a valid date string
  count: createNumberFromString(200).optional().nullable(), // Optional, specifies the number of occurrences
  byday: z.array(byDayEnum).or(byDayEnum).optional().nullable(), // Optional array of days of the week
  bymonthday: byMonthDay,
  bymonth: byMonthEnum,
  bysetpos: bySetPos,
});

const pomodoroSettingSchema = z.object({
  studioTime: z.preprocess((value) => Number(value), z.number()),
  riposoTime: z.preprocess((value) => Number(value), z.number()),
  nCicli: z.preprocess((value) => Number(value), z.number()),
  isComplete: z.boolean()
})

//Attendee schema
const attendeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  accepted: z.boolean().optional().nullable(),
  responded: z.boolean().optional().nullable(),
});

//Notifications schema
const notificationAdvanceEnum = z.enum(["DAYS", "HOURS", "MINUTES"]);
const notificationsFrequencyEnum = z.enum(["MINUTELY", "HOURLY", "DAILY"]);
const notificationsSchema = z
  .object({
    notifica_email: z.boolean().default(false).optional().nullable(),
    notifica_desktop: z.boolean().default(false).optional().nullable(),
    text: z.string().min(1).optional().nullable(), // Ensure text is a non-empty string
    before: z.boolean().optional().nullable(),
    advance: createNumberFromString(5).optional().nullable(),
    repetitions: createNumberFromString(5).optional().nullable(),
    frequency: createNumberFromString(5).optional().nullable(),
    frequencyType: notificationsFrequencyEnum.optional().nullable(),
    advanceType: notificationAdvanceEnum.optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.frequencyType === undefined) return true;
      if (data.repetitions !== undefined && data.frequencyType === "DAILY") {
        return data.repetitions && data?.repetitions <= 5;
      }
      return true;
    },
    {
      message: "With daily frequency, repetitions must be 5 or less",
    },
  );

//Event schema
export const eventSchema = z.object({
  _id: z.string().optional().nullable(),
  title: z.string().min(2).max(30),
  description: z.string().min(2).max(150),
  date: dateFromString,
  endDate: dateFromString,
  duration: z.number().positive().optional().nullable(),
  nextDate: z.date().optional().nullable(),
  location: z.string().optional().nullable(),
  url: z.string().url().optional().or(z.literal("")),
  recurrenceRule: z.union([rruleSchema, z.string()]).optional().nullable(),
  attendees: z.array(attendeeSchema).optional().nullable(),
  notifications: notificationsSchema.optional().nullable(),
  isRecurring: z.boolean(),
  timezone: z.string(),
  isPomodoro: z.boolean(),
  pomodoroSetting: pomodoroSettingSchema,
});

export const eventFormSchema = eventSchema
  .pick({
    title: true,
    description: true,
    date: true,
    endDate: true,
    location: true,
    url: true,
    recurrenceRule: true,
    attendees: true,
    notifications: true,
    isRecurring: true,
    timezone: true,
    isPomodoro: true,
    pomodoroSetting: true,
  })
  .refine(
    (data) => {
      if (data.date.getTime() - data.endDate.getTime() > 0) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type Event = z.infer<typeof eventSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>;
export type EventsState = {
  events: Event[];
};
export type EventsAction =
  | {
      type: "SET_EVENTS";
      payload: Event[];
    }
  | {
      type: "CREATE_EVENT";
      payload: Event;
    }
  | {
      type: "DELETE_ONE";
      payload: string;
    }
  | {
      type: "DELETE_ALL";
    }
  | {
      type: "EDIT_EVENT";
      payload: Event;
    };
export type EventsContextType = {
  events: Event[];
  dispatch: React.Dispatch<EventsAction>;
};

export type EventDetailsProps = {
  event: Event | undefined;
  date: Date | undefined;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | undefined;
