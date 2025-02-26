import { DateTime } from "luxon";
import { useActivitiesContext } from "../hooks/useActivitiesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Activity } from "../utils/types";
import { EventModalForm } from "./EventModalForm";

type ActivityCardProps = {
    activity: Activity;
    isPreview: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isPreview }: ActivityCardProps) => {
    const { dispatch } = useActivitiesContext();
    const { user } = useAuthContext();
    const start: DateTime = DateTime.fromJSDate(activity.date);

    let start2: DateTime | undefined = activity.timezone != Intl.DateTimeFormat().resolvedOptions().timeZone ? start.setZone(activity.timezone as string) : undefined;

    const handleDeleteActivity = () => {
        if (activity._id) {
            fetch(`/api/activities/${activity._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            }).then(() => {
                dispatch({ type: 'DELETE_ONE', payload: activity._id || '' });
            });
        }
    }

    return (
        <div className={`card mb-3 ${activity.isCompleted ? "bg-success bg-opacity-25" : "bg-danger bg-opacity-25"}`}>
            <div className="card-body">
                <h5 className="card-title">{activity.title}</h5>
                <div>
                    {start2 && (<h6>In the actual timezone: </h6>)}
                    <p><i className="bi bi-clock-fill me-2"></i>{start.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                </div>
                {
                    start2 && (
                        <div>
                            {start2 && (<h6>In the activity's timezone: </h6>)}
                            <p><i className="bi bi-clock-fill me-2"></i>{start2.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                        </div>
                    )
                }
                {!activity.isCompleted && <p>Not completed yet !!</p>}
                {!isPreview && activity._id_user === user._id && <button className="btn btn-danger me-2" onClick={handleDeleteActivity}>Delete</button>}
                {!isPreview && <EventModalForm activity={activity} isActivity={true} />}
            </div>
        </div>
    );
}
