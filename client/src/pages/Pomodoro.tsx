import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { PomodoroSettings } from '../components/PomodoroSettings';
import '../css/pomodoro.css';
import { Time, toNum, toTime } from '../utils/pomUtils';
import { PomodoroSetting } from '../utils/types';
const Pomodoro: React.FC = () => {

    const navigate = useNavigate();

    let location = useLocation();
    const { eventIdFromEvent, settingFromEvent } = location.state || {};

    //tempi di studio e riposo del timer (non variano mentre scorre il timer)
    const [eventId, setEventId] = useState<string | null>(location.state ? eventIdFromEvent : null)

    const [studioTime, setStudioTime] = useState<Time>(location.state ? toTime(settingFromEvent.studioTime) : toTime(30));
    const [riposoTime, setRiposoTime] = useState<Time>(location.state ? toTime(settingFromEvent.riposoTime) : toTime(5));
    const [cicliRimanenti, setCicliRimanenti] = useState<number>(location.state ? settingFromEvent.nCicli : 5);
    const [isComplete, setIsComplete] = useState<boolean>(location.state ? settingFromEvent.isComplete : false);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    //tempo che viene visualizzato sul display e cambia allo scorrere del timer
    const [displayTime, setDisplayTime] = useState<Time>(studioTime);

    const [isRunning, setIsRunning] = useState<boolean>(false); //stato che indica se il timer sta andando
    const [isStudying, setIsStudying] = useState<boolean>(true); //stato che indica se si è in sessione di studio o riposo

    //id timer
    // let timerId: number | null = null;
    const [timerId, setTimerId] = useState<number | null>(null);


    //aggiorno il display con il nuovo studioTime se sto studiando
    useEffect(() => {
        if (isStudying) {
            setDisplayTime(studioTime);
        }
    }, [studioTime]);

    //aggiorno il display con il nuovo riposoTime se sono in pausa
    useEffect(() => {
        if (!isStudying) {
            setDisplayTime(riposoTime);
        }
    }, [riposoTime]);

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

    // const handleOpenSettings = () => setIsSettingsOpen(true);
    // const handleCloseSettings = () => setIsSettingsOpen(false);
    //
    // const handleSaveSetting = (newSetting : PomodoroSetting) => {
    //     setStudioTime(toTime(newSetting.studioTime));
    //     setRiposoTime(toTime(newSetting.riposoTime));
    //     setCicliRimanenti(newSetting.nCicli);
    //     setIsSettingsOpen(false);
    // };

    useEffect(() => {
        setIsComplete(cicliRimanenti <= 0 ? true : false);
        if (isComplete) {
            stop();
        }
        updatePomodoroEvent();
    }, [cicliRimanenti]);

    const decrementaCicli = () => {
        setCicliRimanenti(prevCicli => {
            const newCicli = prevCicli - 1;
            return newCicli;
        });
    };

    useEffect(() => {
        console.log(timerId);
        if ((toNum(displayTime) + (displayTime.seconds ? displayTime.seconds : 0)) <= 0) {

            if (!isStudying) {
                decrementaCicli();
                updatePomodoroEvent();
                setDisplayTime(studioTime);
                setIsStudying(true);
            }
            else {
                setDisplayTime(riposoTime);
                setIsStudying(false);
            }
        }
    }, [displayTime])

    const start = () => {
        // console.log('timerid start: ' + timerId);
        if (timerId == null && !isRunning) {
            setIsRunning(true);
            const id = window.setInterval(() => {
                setDisplayTime((prevDisplay) => {
                    let newDisplay = { ...prevDisplay };

                    if (newDisplay.seconds && newDisplay.seconds > 0) {
                        newDisplay.seconds -= 1;
                    } else if (newDisplay.minutes > 0) {
                        newDisplay.seconds = 59;
                        newDisplay.minutes -= 1;
                    } else if (newDisplay.hours > 0) {
                        newDisplay.minutes = 59;
                        newDisplay.seconds = 59;
                        newDisplay.hours -= 1;
                    }
                    return newDisplay;
                })
                console.log(timerId);
            }, 1000);
            setTimerId(id); // Salva l'ID del timer
        };
    };

    //funzione per fermare il timer
    const stop = () => {
        if (timerId) {
            console.log('stop');
            clearInterval(timerId);
            setTimerId(null);
            setIsRunning(false); //timer fermo
        }
    };

    //funzione per resettare il timer
    const reset = () => {
        setDisplayTime(isStudying ? { ...studioTime } : { ...riposoTime });
    };

    //funzione per saltare alla fase successiva
    const skip = () => {
        // console.log('isrunning  ' +isRunning);
        // console.log('isstudying ' +isStudying);
        if (isRunning) {
            if (timerId) {
                clearInterval(timerId);
            }
            setTimerId(null);
            setIsStudying(!isStudying);
            setDisplayTime(isStudying ? { ...riposoTime } : { ...studioTime });
            setIsRunning(false);
        }
        if (!isStudying) {
            decrementaCicli();
        }
        setIsStudying(!isStudying);
        setDisplayTime(isStudying ? { ...riposoTime } : { ...studioTime });
    };

    //funzione per visualizzazione timer
    const format_time = (time: Time): string => {
        let hours = time.hours > 0 ? `${out_cifre(time.hours)}:` : '';
        return `${hours}${out_cifre(time.minutes)}:${time.seconds ? out_cifre(time.seconds) : out_cifre(0)}`;
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
        setDisplayTime(toTime(30));
    }
    return (
        <div className="container mt-4">
            {isComplete ? (
                <div className="text-center">
                    <p className="display-6">This study session has been completed!</p>
                    {location.state && (
                        <Button variant="secondary" onClick={backToCalendar}>
                            Go back to Calendar
                        </Button>
                    )}
                    <Button className="ms-3" variant="primary" onClick={newSession}>
                        Start a New Session
                    </Button>
                </div>
            ) : (
                <>
                    <div className={`card text-center mb-4 ${isStudying ? 'bg-primary text-white' : 'bg-success text-white'}`}>
                        <div className="card-body">
                            <h1 className="display-1">{format_time(displayTime)}</h1>
                            <p className="lead">{isStudying ? 'Studio' : 'Riposo'}</p>
                            <p className="mb-0">
                                Remaining Cycles: <strong>{cicliRimanenti}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-3">
                        {!isRunning && (
                            <Button variant="success" onClick={start}>
                                <i className="bi bi-play-circle"></i> Start
                            </Button>
                        )}
                        {isRunning && (
                            <Button variant="danger" onClick={stop}>
                                <i className="bi bi-pause-circle"></i> Stop
                            </Button>
                        )}
                        <Button variant="warning" onClick={reset}>
                            <i className="bi bi-arrow-counterclockwise"></i> Reset
                        </Button>
                        <Button variant="info" onClick={skip}>
                            <i className="bi bi-skip-forward-circle"></i> Skip
                        </Button>
                    </div>
                    {!location.state && (
                        <div className="mt-4 text-center">
                            {!isSettingsOpen ? (
                                <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
                                    <i className="bi bi-gear-fill"></i> Settings
                                </Button>
                            ) : (
                                <PomodoroSettings
                                    onClose={() => setIsSettingsOpen(false)}
                                    onSave={(newSetting: PomodoroSetting) => {
                                        setStudioTime(toTime(newSetting.studioTime));
                                        setRiposoTime(toTime(newSetting.riposoTime));
                                        setCicliRimanenti(newSetting.nCicli);
                                        setIsSettingsOpen(false);
                                    }}
                                    prevSetting={{
                                        studioTime: toNum(studioTime),
                                        riposoTime: toNum(riposoTime),
                                        nCicli: cicliRimanenti,
                                        isComplete: isComplete,
                                    }}
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Pomodoro;
