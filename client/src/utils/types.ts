import { z } from "zod";

//date-string preprocessing
const dateFromString = z.preprocess((val) => {
    if (typeof val === "string") {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return val; // If it's already a date, return it
}, z.date());

//date-string preprocessing, but optional
const dateFromStringOptional = z.preprocess((val) => {
    if (typeof val === "string") {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return val; // If it's already a date, return it
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
export const noteFilterSchema = z
    .object({
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
    })
    .refine(
        (data) => {
            if (data.start && data.end) {
                return data.start.getTime() <= data.end.getTime();
            } else if (!data.start && !data.end) {
                return true;
            } else return false;
        },
        {
            message: "Start date must be before end date",
            path: ["start"],
        },
    );

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
            z.string().transform((str) =>
                str
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
            ),
            z.array(z.string()),
        ])
        .optional(),
    tags: z
        .union([
            z.string().transform((str) =>
                str
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
            ),
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
    isComplete: z.boolean(),
});

//Attendee schema
export const attendeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").default("default@mail.com"),
    accepted: z.boolean().default(false),
    responded: z.boolean().default(false),
});

//Attendee type
export type Attendee = z.infer<typeof attendeeSchema>;

//Notifications schema
const notificationAdvanceEnum = z.enum(["DAYS", "HOURS", "MINUTES"]);
const notificationsFrequencyEnum = z.enum(["MINUTELY", "HOURLY", "DAILY"]);
const notificationsSchema = z
    .object({
        notifica_email: z.boolean().default(false).optional().nullable(),
        notifica_desktop: z.boolean().default(false).optional().nullable(),
        text: z.string().min(1).optional().nullable(), // Ensure text is a non-empty string
        before: z.boolean().optional().nullable(),
        advance: createNumberFromString(10000).optional().nullable(),
        repetitions: createNumberFromString(10000).optional().nullable(),
        frequency: createNumberFromString(10000).optional().nullable(),
        frequencyType: notificationsFrequencyEnum.optional().nullable(),
        advanceType: notificationAdvanceEnum.optional().nullable(),
    })
    .refine(
        (data) => {
            if (!data.advanceType) return true;
            if (data.advanceType === "DAYS" && data.advance) return data.advance <= 5;
            if (data.advanceType === "HOURS" && data.advance)
                return data.advance <= 120;
            if (data.advanceType === "MINUTES" && data.advance)
                return data.advance <= 7200;
            return true;
        },
        {
            message:
                "You cannot set notifications with an advance higher than 5 days",
        },
    )
    .refine(
        (data) => {
            if (!data.frequencyType) return true;
            if (data.repetitions && data.frequencyType === "DAILY") {
                return data.repetitions && data?.repetitions <= 5;
            }
            if (
                data.advance &&
                data.frequency &&
                data.repetitions &&
                data.advanceType === "HOURS"
            ) {
                switch (data.frequencyType) {
                    case "DAILY":
                        return data.repetitions * data.frequency * 24 <= data.advance;
                    case "HOURLY":
                        return data.repetitions * data.frequency <= data.advance;
                    case "MINUTELY":
                        return data.repetitions * (data.frequency / 60) <= data.advance;
                    default:
                        break;
                }
            }
            if (
                data.advance &&
                data.frequency &&
                data.repetitions &&
                data.advanceType === "MINUTES"
            ) {
                switch (data.frequencyType) {
                    case "DAILY":
                        return data.repetitions * data.frequency * 24 * 60 <= data.advance;
                    case "HOURLY":
                        return data.repetitions * data.frequency * 60 <= data.advance;
                    case "MINUTELY":
                        return data.repetitions * data.frequency <= data.advance;
                    default:
                        break;
                }
            }
            if (
                data.advance &&
                data.frequency &&
                data.repetitions &&
                data.advanceType === "DAYS"
            ) {
                switch (data.frequencyType) {
                    case "DAILY":
                        return data.repetitions * data.frequency <= data.advance;
                    case "HOURLY":
                        return (data.repetitions * data.frequency) / 24 <= data.advance;
                    case "MINUTELY":
                        return (
                            (data.repetitions * data.frequency) / (60 * 24) <= data.advance
                        );
                    default:
                        break;
                }
            }
            return true;
        },
        {
            message: "You cannot set notifications after start of the event/activity.",
        },
    );

//Event schema
export const eventSchema = z.object({
    _id: z.string().optional().nullable(),
    title: z.string().min(2).max(30),
    description: z.string().min(2).max(150),
    date: dateFromString,
    endDate: dateFromStringOptional,
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
    isDoNotDisturb: z.boolean(),
    pomodoroSetting: pomodoroSettingSchema,
    _id_user: z.string(),
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
        notifications: true,
        isRecurring: true,
        timezone: true,
        isPomodoro: true,
        isDoNotDisturb: true,
        pomodoroSetting: true,
    })
    .merge(
        z.object({
            attendees: z
                .union([
                    z.array(z.string()),
                    z.string().transform((val: string) =>
                        val
                            .split(",")
                            .map((val) => val.trim())
                            .filter((val) => val !== ""),
                    ),
                ])
                .optional()
                .nullable(),
        }),
    )
    .refine(
        (data) => {
            if (!data.isPomodoro && !data.endDate) return false;
            return true;
        },
        {
            message: "End date is required if event is not a pomodoro",
            path: ["endDate"],
        },
    )
    .refine(
        (data) => {
            if (data.isPomodoro) return true;
            if (data.endDate && data.date.getTime() - data.endDate.getTime() > 0) {
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

export type PomodoroSetting = z.infer<typeof pomodoroSettingSchema>;

export type EventsState = {
    events: Event[];
};

export type EventsAction =
    | {
        type: "SET_EVENTS";
        payload: Event[];
    }
    | {
        type: "ADD_EVENTS";
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
    id: string | undefined | null;
    date: Date | undefined;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | undefined;

export const activitySchema = z.object({
    _id: z.string().optional().nullable(),
    title: z.string().min(2).max(30),
    description: z.string().min(2).max(150),
    date: dateFromString,
    isCompleted: z.boolean(),
    attendees: z.array(attendeeSchema).optional().nullable(),
    notifications: notificationsSchema.optional().nullable(),
    _id_user: z.string(),
    timezone: z.string(),
});

export const activityFormSchema = activitySchema
    .pick({
        title: true,
        description: true,
        date: true,
        notifications: true,
        timezone: true,
        isCompleted: true,
    })
    .merge(
        z.object({
            attendees: z
                .union([
                    z.array(z.string()),
                    z.string().transform((val: string) =>
                        val
                            .split(",")
                            .map((val) => val.trim())
                            .filter((val) => val !== ""),
                    ),
                ])
                .optional()
                .nullable(),
        }),
    );

export type Activity = z.infer<typeof activitySchema>;

export type ActivityFormData = z.infer<typeof activityFormSchema>;

export type ActivitiesState = {
    activities: Activity[];
};

export type ActivitiesAction =
    | {
        type: "SET_ACTIVITIES";
        payload: Activity[];
    }
    | {
        type: "ADD_ACTIVITIES";
        payload: Activity[];
    }
    | {
        type: "CREATE_ACTIVITY";
        payload: Activity;
    }
    | {
        type: "DELETE_ONE";
        payload: string;
    }
    | {
        type: "DELETE_ALL";
    }
    | {
        type: "EDIT_ACTIVITY";
        payload: Activity;
    };

export type ActivitiesContextType = {
    activities: Activity[];
    dispatch: React.Dispatch<ActivitiesAction>;
};

export type ActivityDetailsProps = {
    id: string | undefined | null;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};
