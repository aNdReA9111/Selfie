//custom types for time machine context
export type TimeMachineState = {
  offset: number
}

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
