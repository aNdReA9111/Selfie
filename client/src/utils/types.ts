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
    };
export type NotesContextType = {
  notes: Note[];
  dispatch: React.Dispatch<NotesAction>;
};
