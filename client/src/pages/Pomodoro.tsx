import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

interface Time {
    seconds: number;
    minutes: number;
    hours: number;
}

const Pomodoro: React.FC = () => {

    //funzione per convertire minuti in Time
    const toTime = (min: number): Time => {
        return {
            hours: Math.floor(min / 60), minutes: min % 60, seconds: 0,
        };
    };

    const navigate = useNavigate();

    let location = useLocation();
    const { eventIdFromEvent, settingFromEvent } = location.state || {};

    //tempi di studio e riposo del timer (non variano mentre scorre il timer)
    const [eventId, setEventId] = useState<string | null>(location.state ? eventIdFromEvent : null)
    const [studioTime, setStudioTime] = useState<Time>(location.state ? toTime(settingFromEvent.studioTime) : toTime(30));
    const [riposoTime, setRiposoTime] = useState<Time>(location.state ? toTime(settingFromEvent.riposoTime) : toTime(5));
    const [cicliRimanenti, setCicliRimanenti] = useState<number>(location.state ? settingFromEvent.nCicli : 5);
    const [isComplete, setIsComplete] = useState<boolean>(location.state ? settingFromEvent.isComplete : false);

    //tempo che viene visualizzato sul display e cambia allo scorrere del timer
    const [displayTime, setDisplayTime] = useState<Time>(studioTime);

    const [isRunning, setIsRunning] = useState<boolean>(false); //stato che indica se il timer sta andando
    const [isStudying, setIsStudying] = useState<boolean>(true); //stato che indica se si è in sessione di studio o riposo

    //id timer
    const [timerId, setTimerId] = useState<number | undefined>(undefined);

    //ref per input di tempo studio e riposo
    const studioRef = useRef<HTMLInputElement>(null);
    const riposoRef = useRef<HTMLInputElement>(null);
    const cicliRef = useRef<HTMLInputElement>(null);

    //aggiornamneto tempi di studio e riposo
    const data_update = () => {
        let tmp_studio = studioRef.current ? toTime(parseInt(studioRef.current.value, 10)) : studioTime;
        let tmp_riposo = riposoRef.current ? toTime(parseInt(riposoRef.current.value, 10)) : riposoTime;
        setStudioTime(tmp_studio);
        setRiposoTime(tmp_riposo);
        setDisplayTime(isStudying ? tmp_studio : tmp_riposo);
    };

    const updatePomodoroEvent = async () => {
        try {
            await fetch('/api/events' + (eventId ? `/${eventId}` : ''), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify({
                    pomodoroSetting: { "studioTime": settingFromEvent.studioTime, "riposoTime": settingFromEvent.riposoTime, "nCicli": cicliRimanenti, "isComplete": cicliRimanenti > 0 ? false : true }
                })
            });
        } catch (error) {
            console.error(error);
        }
    }

    const checkComplete = () => {
        if (cicliRimanenti <= 1) {    //da aggiustare bug per il quale cicliRimanenti non viene aggiornato correttamente
            setIsComplete(true);
        }
    }

    //avvio timer
    const start = () => {

        setIsRunning(true); //timer attivo
        if (!timerId) {
            const id = window.setInterval(() => {

                //aggiorno il nuovo display in base a quello corrente
                setDisplayTime((prev_display) => {
                    let new_display = { ...prev_display };  //copio i singoli elementi senza referenziare
                    if (new_display.seconds > 0) {
                        new_display.seconds -= 1;
                    }
                    else if (new_display.minutes > 0) {
                        new_display.seconds = 59;
                        new_display.minutes -= 1;
                    }
                    else if (new_display.hours > 0) {
                        new_display.minutes = 59;
                        new_display.seconds = 59;
                        new_display.hours -= 1;
                    } else {
                        clearInterval(timerId);
                        setTimerId(undefined);

                        if (!isStudying) {
                            console.log("ciaomare");
                            console.log(cicliRimanenti.toString());
                            setCicliRimanenti(cicliRimanenti - 1);
                            checkComplete();
                            updatePomodoroEvent();
                        }
                        pomodoro();
                    }
                    return new_display;
                });
            }, 1000);
            setTimerId(id);
        }
    };

    //funzione per fermare il timer
    const stop = () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(undefined);
            setIsRunning(false); //timer fermo
        }
    };

    //funzione per resettare il timer
    const reset = () => {
        data_update();
        setDisplayTime(isStudying ? { ...studioTime } : { ...riposoTime });
    };


    //funzione per saltare alla fase successiva
    const skip = () => {
        data_update();
        if (!isRunning) {
            setIsStudying(!isStudying);
            setDisplayTime(isStudying ? { ...riposoTime } : { ...studioTime });
            // console.log("ciao mare");
            if (!isStudying) {
                setCicliRimanenti(cicliRimanenti - 1);
                checkComplete();
                updatePomodoroEvent();
            }
        }
        else {
            clearInterval(timerId);
            setTimerId(undefined);
            pomodoro();
        }
    };

    //funzione principale che gestisce le sessioni di studio e pausa
    const pomodoro = () => {
        if (isStudying) {
            setIsStudying(false);
            setDisplayTime({ ...riposoTime });
        }
        else {
            setIsStudying(true);
            setDisplayTime({ ...studioTime });
        }
        start();
    };

    //funzione per visualizzazione timer
    const format_time = (time: Time): string => {
        let hours = time.hours > 0 ? `${out_cifre(time.hours)}:` : '';
        return `${hours}${out_cifre(time.minutes)}:${out_cifre(time.seconds)}`;
    };

    //cifre da numero a stringa con due caratteri
    const out_cifre = (n: number): string => {
        if (n < 10)
            return '0' + n.toString();
        else
            return n.toString();
    }

    const backToCalendar = () => {
        navigate("/calendar");
    }

    const newSession = () => {
        location.state = undefined;
        setEventId(null);
        setStudioTime(toTime(30));
        setRiposoTime(toTime(5));
        setCicliRimanenti(5);
        setIsComplete(false);
        setDisplayTime(studioTime);
    }

    if (isComplete) {
        return (
            <>
                <p>This study session has been completed</p>
                <div>
                    {location.state && (
                        <Button onClick={backToCalendar}>Go back to calendar</Button>
                    )}
                </div>
                <div>
                    <Button onClick={newSession}>Start a new session</Button>
                </div>
                <p>{isComplete.toString()}</p>
                <p>{cicliRimanenti.toString()}</p>
            </>
        )
    }
    else {
        return (
            <>
                <div>
                    <h1>{format_time(displayTime)}</h1>
                </div>
                <div>
                    <div>
                        <label>
                            Study time:
                            <input ref={studioRef} type="number" step="5" defaultValue={studioTime.minutes + studioTime.hours * 60} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Rest time:
                            <input ref={riposoRef} type="number" defaultValue={riposoTime.minutes + riposoTime.hours * 60} />
                        </label>
                    </div>
                    <div>
                        {!location.state && (
                            <label>
                                cicli
                                <input ref={cicliRef} type="number" defaultValue={cicliRimanenti} />
                            </label>
                        )}

                    </div>
                    <div>
                        <label>remaining cycles: {cicliRimanenti}</label>
                    </div>
                    <div>
                        <button onClick={data_update}>Update</button>
                    </div>
                </div>
                <p>{isStudying ? 'Studio' : 'Riposo'}</p>
                <div>
                    <button onClick={start}>Start</button>
                    <button onClick={stop}>Stop</button>
                    <button onClick={reset}>Reset</button>
                    <button onClick={skip}>Skip</button>
                </div>
            </>
        );
    }

};


export default Pomodoro;
