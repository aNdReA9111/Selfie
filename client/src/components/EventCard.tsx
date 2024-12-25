import { DateTime } from "luxon";

type EventCardProps = {
    title: string;
    timezone: string;
    date: Date;
    endDate: Date;
}

/* Event card for homepage events' preview */
export const EventCard: React.FC<EventCardProps> = ({ title, timezone, date, endDate }: EventCardProps) => {
    const start: DateTime = DateTime.fromJSDate(date);
    const end: DateTime = DateTime.fromJSDate(endDate);

    let start2: DateTime | undefined = timezone != Intl.DateTimeFormat().resolvedOptions().timeZone ? start.setZone(timezone as string) : undefined;
    let end2: DateTime | undefined = timezone != Intl.DateTimeFormat().resolvedOptions().timeZone ? end.setZone(timezone as string) : undefined;

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <div>
                    {start2 && end2 && (<h6>In the actual timezone: </h6>)}
                    <p><i className="bi bi-clock-fill me-2"></i>{start.toLocaleString(DateTime.DATETIME_SHORT)} - {end.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                </div>
                {
                    start2 && end2 && (
                        <div>
                            {start2 && end2 && (<h6>In the event's timezone: </h6>)}
                            <p><i className="bi bi-clock-fill me-2"></i>{start2.toLocaleString(DateTime.DATETIME_SHORT)} - {end2.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
