import { DateTime } from "luxon";

type ActivityCardProps = {
    title: string;
    timezone: string;
    date: Date;
    isCompleted: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ title, timezone, date, isCompleted }: ActivityCardProps) => {
    const start: DateTime = DateTime.fromJSDate(date);

    let start2: DateTime | undefined = timezone != Intl.DateTimeFormat().resolvedOptions().timeZone ? start.setZone(timezone as string) : undefined;

    return (
        <div className={`card mb-3 ${isCompleted ? "bg-success bg-opacity-25" : "bg-danger bg-opacity-25"}`}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <div>
                    {start2 && (<h6>In the actual timezone: </h6>)}
                    <p><i className="bi bi-clock-fill me-2"></i>{start.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                </div>
                {
                    start2 && (
                        <div>
                            {start2 && (<h6>In the event's timezone: </h6>)}
                            <p><i className="bi bi-clock-fill me-2"></i>{start2.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                        </div>
                    )
                }
                {!isCompleted && <p>Not completed yet !!</p>}
            </div>
        </div>
    );
}
