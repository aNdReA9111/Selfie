import { DateTime } from "luxon";
import { EventModel } from "../models/eventModel.js";

/*function to change the date of an incomplete pomodoro*/

export async function updatePastPomodoro(user: string, mail: string, dateOffset: number) {
    await EventModel.updateMany(
        {
            $or: [
                { _id_user: user },
                {
                    attendees: {
                        $elemMatch: {
                            email: mail,
                            responded: true,
                            accepted: true,
                        },
                    },
                },
            ],
            isPomodoro: true,
            "pomodoroSetting.isComplete": false,
            isRecurring: false,
        },

        [
            {
                $set: {
                    date: DateTime.now().plus(dateOffset).set({ hour: 18, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
                    endDate: DateTime.now().plus(dateOffset).set({ hour: 20, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
                },
            },
        ],
    );
}
