import { useState, useEffect, ReactNode } from 'react';
import { useTimeMachineContext } from '../hooks/useTimeMachineContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { DateTime } from 'luxon';

export const TimeMachine = (): ReactNode => {
    const [date, setDate] = useState<string>(DateTime.now().toISO());

    const { dispatch } = useTimeMachineContext();
    const { user } = useAuthContext();

    /*initial offset*/
    useEffect(() => {
        dispatch({ type: "SET_OFFSET", payload: user.dateOffset });
    }, []);

    const updateUserOffset = async (offset: number) => {
        try {
            const res = await fetch("/api/timeMachine", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify({ offset })
            }
            );

            if (!res.ok) {
                console.log(res);
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const off = await res.json();

            dispatch({ type: "SET_OFFSET", payload: off.dateOffset });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        updateUserOffset(DateTime.fromISO(date).toMillis() - DateTime.now().toMillis());
    };

    const reset = () => {
        updateUserOffset(0);
        setDate(DateTime.now().toISO({ suppressSeconds: true }));
    }

    return (
        <div className="d-flex flex-row justify-content-center align-itmes-center container-fluid">
            <form onSubmit={handleSubmit} className="container-fluid">
                <div className="from-control mb-3 d-flex justify-content-between align-itmes-center">
                    <label htmlFor="date_form" className="form-label">Write new date</label>
                    <input
                        style={{ flexShrink: 1 }}
                        onChange={(e) => { setDate(e.target.value) }}
                        type="datetime-local"
                        className="form-control"
                        id="date_form"
                        value={date} />
                    <button className="btn btn-primary">Set Date</button>
                    <button className="btn btn-primary" onClick={reset}>Reset Date</button>
                </div>
            </form>
        </div>
    );
};
