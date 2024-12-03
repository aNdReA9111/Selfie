import { useEffect, useState } from "react";
import { Activity } from "../utils/types";
import { useActivitiesContext } from "./useActivitiesContext";

export const useActivities = (
    url: string,
    query: Record<string, string> = {},
    options: Record<string, any> = {},
    dependencies: any[] = [],
) => {
    const { dispatch } = useActivitiesContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const fetchEvents = async () => {
            try {
                const params = new URLSearchParams(query).toString();
                const res = await fetch(url + params, { method: "GET", ...options });
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const result: Activity[] = await res.json();
                if (!isCancelled) {
                    setIsLoading(false);
                    setError(null);
                    //le date diventano string in json
                    result.forEach((el: Activity) => {
                        el.date = new Date(el.date);
                    });
                    dispatch({ type: "SET_ACTIVITIES", payload: result });
                }
            } catch (err: any) {
                if (!isCancelled) {
                    setIsLoading(false);
                    setError(err.message);
                }
            }
        };

        fetchEvents();

        // Cleanup function to prevent state update if component unmounts
        return () => {
            isCancelled = true;
        };
    }, [url, ...dependencies, dispatch]);

    return { isLoading, error };
};
