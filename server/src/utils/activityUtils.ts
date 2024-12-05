import { DateTime } from "luxon";
import { ActivityModel } from "../models/activityModel.js";

/*function to change the date of late activities*/
export async function changeActivitiesDate(user: string, mail: string, dateOffset: number) {
    await ActivityModel.updateMany(
        /*get non-completed late activities for the user*/
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
            isCompleted: false,
            date: { $lte: DateTime.now().plus(dateOffset).startOf("day").toJSDate() },
        },

        /*change late activities' date*/
        [
            {
                $set: {
                    date: {
                        $dateAdd: {
                            startDate: "$date",
                            unit: "day",
                            amount: {
                                $dateDiff: {
                                    startDate: "$date",
                                    endDate: DateTime.now().plus(dateOffset).toJSDate(),
                                    unit: "day",
                                },
                            },
                        },
                    },
                },
            },
        ],
    );
}
