import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import DisappearingCircle from '../components/DisappearingCircle';
import { PomodoroSettings } from '../components/PomodoroSettings';
import SecondsCircle from '../components/secondsCircle';
import '../css/pomodoro.css';
import { formatTime, Time, toNum, toTime } from '../utils/pomUtils';
import { PomodoroSetting } from '../utils/types';

enum PomNotificationType { START, STUDY, REST, END }

const Pomodoro: React.FC = () => {

    const navigate = useNavigate();

    let location = useLocation();
    const { eventIdFromEvent, settingFromEvent, isRecurFromEvent } = location.state || {};

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
    const [timerId, setTimerId] = useState<number | null>(null);

    const [secTick, setSecTick] = useState<number>(0);



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


    const sendPomNotification = async (notificationType: PomNotificationType) => {
        if (Notification.permission === "granted") {
            let text = ""
            switch (notificationType) {
                case PomNotificationType.START:
                    text = "Started Pomodoro";
                    break;
                case PomNotificationType.STUDY:
                    text = "Started Study time";
                    break;
                case PomNotificationType.REST:
                    text = "Started Rest time";
                    break;
                case PomNotificationType.END:
                    text = "Finished Pomodoro";
                    break;
                default:
                    break;
            }

            new Notification("Selfie Pomodoro", { body: text, icon: "../assets/logo.png" });
        }
    }

    const updatePomodoroEvent = async () => {
        try {
            await fetch('/api/events' + (eventId ? `/${eventId}` : ''), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify({
                    pomodoroSetting: { "studioTime": toNum(studioTime), "riposoTime": toNum(riposoTime), "nCicli": cicliRimanenti, "isComplete": cicliRimanenti > 0 ? false : true }
                })
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setIsComplete(cicliRimanenti <= 0 ? true : false);
        if (isComplete) {
            sendPomNotification(PomNotificationType.END)
            stop();
        }
        if (eventId && !isRecurFromEvent) {
            updatePomodoroEvent();
        }
    }, [cicliRimanenti]);

    const decrementaCicli = () => {
        setCicliRimanenti(prevCicli => {
            const newCicli = prevCicli - 1;
            return newCicli;
        });
    };

    useEffect(() => {
        if ((toNum(displayTime) + (displayTime.seconds ? displayTime.seconds : 0)) <= 0) {

            if (!isStudying) {
                decrementaCicli();
                if (eventId) {
                    updatePomodoroEvent();
                }
                setDisplayTime(studioTime);
                setIsStudying(true);
                sendPomNotification(PomNotificationType.STUDY);
            }
            else {
                setDisplayTime(riposoTime);
                setIsStudying(false);
                sendPomNotification(PomNotificationType.STUDY);
            }
        }
    }, [displayTime])

    const tick = async () => {
        if (secTick == 0) {
            setSecTick(1);
        } else {
            setSecTick(0);
        }
    }

    useEffect(() => {
        tick();
    }, [displayTime.seconds])

    const start = () => {
        if (timerId == null && !isRunning) {
            setIsRunning(true);
            sendPomNotification(PomNotificationType.START);
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
            }, 1000);
            setTimerId(id);
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

    const restartCycle = () => {
        setDisplayTime({ ...studioTime });
        setIsStudying(true);
    };

    //funzione per saltare alla fase successiva
    const skip = () => {

        if (isRunning) {
            if (timerId) {
                clearInterval(timerId);
            }
            setTimerId(null);
            setIsRunning(false);
        }
        if (!isStudying) {
            decrementaCicli();
        }
        setIsStudying(!isStudying);
        setDisplayTime(isStudying ? { ...riposoTime } : { ...studioTime });
    };

    const skipCycle = () => {

        if (isRunning) {
            if (timerId) {
                clearInterval(timerId);
            }
            setTimerId(null);
            setIsRunning(false);
        }
        decrementaCicli();
        setIsStudying(true);
        setDisplayTime({ ...studioTime });
    };

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
        <div style={{ backgroundColor: "rgb(90, 5, 20)", minHeight: "100vh" }}>
            {isComplete ? (
                <div className='d-flex justify-content-center'>
                    <div className="d-flex-column justify-content-center mt-4">
                        <div className='d-flex'>
                            <p className="display-6 color-text">This session has been completed!</p>
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            {location.state && (
                                <Button className="color-5" onClick={backToCalendar}>Go back to Calendar</Button>
                            )}
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            <Button onClick={newSession}>Start a New Session</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {!isSettingsOpen && (
                        <div className={isRunning ? 'running' : 'notRunning'}>
                            <div className='d-flex-column justify-content-center text-center mt-5'>

                                <div className='d-flex mb-5'>
                                    <div className="d-flex-column mt-5 mb-5 concentric-circles">
                                        {isStudying &&
                                            <>
                                                <div style={{ position: 'absolute' }}>
                                                    <DisappearingCircle
                                                        timeLeft={displayTime.seconds ? displayTime.seconds : 60}
                                                        duration={60}
                                                        size={displayTime.hours > 0 ? 320 : 274}
                                                        color='#801300'
                                                    />
                                                </div>

                                                <div style={{ position: 'absolute' }}>
                                                    <DisappearingCircle
                                                        timeLeft={toNum(displayTime ? displayTime : (isStudying ? studioTime : riposoTime))}
                                                        duration={toNum(isStudying ? studioTime : riposoTime)}
                                                        size={displayTime.hours > 0 ? 340 : 296}
                                                        color='#ff1100'
                                                    />
                                                </div>
                                            </>
                                        }
                                        {!isStudying &&
                                            <>
                                                <div style={{ position: 'absolute' }}>
                                                    <SecondsCircle
                                                        timeLeft={secTick}
                                                        duration={1}
                                                        size={displayTime.hours > 0 ? 350 : 274}
                                                        color='#801300'
                                                    />
                                                </div>

                                                <div style={{ position: 'absolute' }}>
                                                    <DisappearingCircle
                                                        timeLeft={toNum(displayTime ? displayTime : (isStudying ? studioTime : riposoTime))}
                                                        duration={toNum(isStudying ? studioTime : riposoTime)}
                                                        size={displayTime.hours > 0 ? 370 : 296}
                                                        color='#ff1100'
                                                    />
                                                </div>
                                            </>
                                        }

                                        <div className={displayTime.hours > 0 ? 'mt-5' : ''}>
                                            <h1 className="display-1 color-text">{formatTime(displayTime)}</h1>
                                            <h4 className="color-text">{isStudying ? 'Focus on your tasks!' : 'Rest'}</h4>
                                            <p className='color-text' style={{ marginBottom: "0px" }}><strong>{cicliRimanenti}</strong> cycles </p>
                                            <p className='color-text' >to complete </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex-column buttons margin-top-7 align-items-center justify-content-center text-center'>
                                    <div className="d-flex justify-content-center text-center">
                                        <div>
                                            {!isRunning && (
                                                <Button className='color-1 me-2' onClick={start}>
                                                    <i className="bi bi-play-circle"></i> Start
                                                </Button>
                                            )}
                                            {isRunning && (
                                                <Button className='color-2 me-2' onClick={stop} >
                                                    <i className="bi bi-pause-circle"></i> Stop
                                                </Button>
                                            )}
                                            <Button className='color-5 me-2' onClick={reset}>
                                                <i className="bi bi-arrow-counterclockwise"></i> Restart
                                            </Button>
                                            <Button className='color-3' onClick={skip}>
                                                <i className="bi bi-skip-forward-circle"></i> Skip
                                            </Button>
                                        </div>
                                    </div>

                                    <div className='d-flex justify-content-center mt-2 '>
                                        <div>
                                            <Button className='color-4' onClick={restartCycle}>
                                                <i className="bi bi-arrow-counterclockwise"></i> Restart cycle
                                            </Button>
                                            <Button className='color-5 ms-2' onClick={skipCycle}>
                                                <i className="bi bi-skip-forward-circle"></i> Skip cycle
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex mb-5 justify-content-center'>
                                    <div>
                                        {!location.state && !isRunning && (
                                            <div className="mt-4 mb-5">
                                                <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
                                                    <i className="bi bi-gear-fill"></i> Settings
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {isSettingsOpen && (
                <div className='d-flex justify-content-center color-text'>
                    <PomodoroSettings
                        onClose={() => setIsSettingsOpen(false)}
                        onSave={(newSetting: PomodoroSetting) => {
                            setStudioTime(toTime(newSetting.studioTime));
                            setRiposoTime(toTime(newSetting.riposoTime));
                            setCicliRimanenti(newSetting.nCicli);
                            setIsSettingsOpen(false);
                            setIsStudying(true);
                        }}
                        prevSetting={{
                            studioTime: toNum(studioTime),
                            riposoTime: toNum(riposoTime),
                            nCicli: cicliRimanenti,
                            isComplete: isComplete,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Pomodoro;
