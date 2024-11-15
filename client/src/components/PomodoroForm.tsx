import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { EventFormData } from "../utils/types";

export type PomodoroEventFormProps = {
  register: UseFormRegister<EventFormData>;
  setValue: UseFormSetValue<EventFormData>;
};

export const PomodoroForm: React.FC<PomodoroEventFormProps> = ({register, setValue }) => {

  setValue("pomodoroSetting.isComplete", false);

  return (
    <>
      <div>
        <label htmlFor="studioTime">Study time (minutes)
          <input
            id="studioTime"
            type="number"
            defaultValue={30}
            step={5}
            min={5}
            {...register("pomodoroSetting.studioTime")}
          />
        </label>
      </div>

      <div>
        <label htmlFor="riposoTime">Rest time (minutes)
          <input
            id="riposoTime"
            type="number"
            defaultValue={5}
            min={1}
            {...register("pomodoroSetting.riposoTime")}
          />
        </label>
      </div>

      <div>
        <label htmlFor="nCicli">Amount of Pomodoro cycles
          <input
            id="nCicli"
            type="number"
            defaultValue={5}
            min={1}
            {...register("pomodoroSetting.nCicli")}
          />
        </label>
      </div>
    </>
  );
};

