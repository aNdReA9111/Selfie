import { useEffect, useState } from "react";
import { Event } from "../utils/types";
import { useEventsContext } from "./useEventsContext";

export const useEvents = (
    url: string,
    query: Record<string, string> = {},
    options: Record<string, any> = {},
    dependencies: any[] = [],
) => {
    const { dispatch } = useEventsContext();
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

                const result: Event[] = await res.json();
                if (!isCancelled) {
                    setIsLoading(false);
                    setError(null);
                    //le date diventano string in json
                    result.forEach((el: Event) => {
                        el.date = new Date(el.date);
                        el.endDate = new Date(el.endDate as Date);
                    });
                    dispatch({ type: "SET_EVENTS", payload: result });
                    console.log(result);
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
