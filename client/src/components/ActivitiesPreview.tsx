import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityCard } from "../components/ActivityCard";
import { useTimeMachineContext } from "../hooks/useTimeMachineContext";
import { Activity } from "../utils/types";
export const ActivitiesPreview: React.FC = () => {
    const [dayActivities, setDayActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const { offset } = useTimeMachineContext();
    const getActivitiesOfTheDay = async () => {
        try {
            setLoading(true);
            const date: string = DateTime.now().plus(offset).toISODate();
            const res = await fetch(`/api/activities?date=${date}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            });

            if (res.ok) {
                const activities: Activity[] = await res.json();
                activities.forEach((e: Activity) => {
                    e.date = new Date(e.date);
                })

                setLoading(false);
                setDayActivities(activities);
            }
        } catch (error: any) {
            setLoading(false);
            console.log(error);
        }
    }

    console.log("TODAY:", dayActivities);

    useEffect(() => {
        getActivitiesOfTheDay();
    }, [offset]);

    return (
        <div className="d-flex justify-content-center align-items-start pt-2 a">
            {/* Add your content here if needed */}
            {loading && <div>Loading...</div>}
            <div className={`h-100 container d-flex flex-column justify-content-${dayActivities.length > 0 ? "start" : "center"} overflow-y-scroll`}>
                <div className="d-flex justify-content-between align-items-center">
                    <h3>Activities of the day</h3>
                    <button className="btn btn-danger" onClick={() => navigate("/calendar/")}>Go to Calendar<i className="bi bi-box-arrow-up-right ms-2"></i></button>
                </div>
                <div id="activitiesCards">
                    {
                        dayActivities.length > 0 ?
                            dayActivities.map((e: Activity) => (
                                <ActivityCard
                                    key={e._id} // Ensure to use a unique key, assuming `e.id` exists.
                                    title={e.title}
                                    timezone={e.timezone}
                                    date={e.date}
                                    isCompleted={e.isCompleted}
                                />
                            )) :
                            <span>No activities today !!</span>
                    }
                </div>
            </div>
        </div>
    );
};
