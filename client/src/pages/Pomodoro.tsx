import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PomodoroSettings } from '../components/PomodoroSettings';
import { Time, toTime, toNum } from '../utils/pomUtils'
import { PomodoroSetting } from '../utils/types';

const Pomodoro: React.FC = () => {
    
    const navigate = useNavigate();

    let location = useLocation();
    const {eventIdFromEvent, settingFromEvent} = location.state || {};

    //tempi di studio e riposo del timer (non variano mentre scorre il timer)
    const [eventId, setEventId] = useState <string | null> (location.state ? eventIdFromEvent : null)
    
    const [studioTime, setStudioTime] = useState <Time> (location.state ? toTime(settingFromEvent.studioTime) : toTime(30));
    const [riposoTime, setRiposoTime] = useState <Time> (location.state ? toTime(settingFromEvent.riposoTime) : toTime(5));
    const [cicliRimanenti, setCicliRimanenti] = useState <number> (location.state ? settingFromEvent.nCicli : 5);
    const [isComplete, setIsComplete] = useState <boolean> (location.state ? settingFromEvent.isComplete : false);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    //tempo che viene visualizzato sul display e cambia allo scorrere del timer
    const [displayTime, setDisplayTime] = useState <Time> (studioTime);

    const [isRunning, setIsRunning] = useState <boolean> (false); //stato che indica se il timer sta andando
    const [isStudying, setIsStudying] = useState <boolean> (true); //stato che indica se si è in sessione di studio o riposo

    //id timer
    const [timerId, setTimerId] = useState <number | undefined> (undefined);

    //aggiorno il display con il nuovo studioTime se sto studiando
    useEffect(() => {
        if(isStudying){
            setDisplayTime(studioTime);
        }
    }, [studioTime]);

    //aggiorno il display con il nuovo riposoTime se sono in pausa
    useEffect(() => {
        if(!isStudying){
            setDisplayTime(riposoTime);
        }
    }, [riposoTime]);

    const updatePomodoroEvent = async() => {
        try {
            await fetch('/api/events' + (eventId? `/${eventId}` : ''), {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                credentials: "include",
                },
                body: JSON.stringify({
                pomodoroSetting: {"studioTime": settingFromEvent.studioTime, "riposoTime": settingFromEvent.riposoTime, "nCicli":cicliRimanenti, "isComplete": cicliRimanenti>0 ? false : true}
                })
            });
        } catch(error) {
            console.error(error);
        }
    }

    const handleOpenSettings = () => setIsSettingsOpen(true);
    const handleCloseSettings = () => setIsSettingsOpen(false);

    const handleSaveSetting = (newSetting : PomodoroSetting) => {
        setStudioTime(toTime(newSetting.studioTime));
        setRiposoTime(toTime(newSetting.riposoTime));
        setCicliRimanenti(newSetting.nCicli);
        setIsSettingsOpen(false); // Chiudi il modal dopo aver salvato
    };

    useEffect(() =>{
        setIsComplete(cicliRimanenti<=0 ? true : false);
        updatePomodoroEvent();
    },[cicliRimanenti]);

    const decrementaCicli = () => {
        setCicliRimanenti(prevCicli => {
            const newCicli = prevCicli -1;
            return newCicli;
        });
    };

    //avvio timer
    const start = () => {
        
        setIsRunning(true); //timer attivo
        if(!timerId){
            const id = window.setInterval(() => {
                
                //aggiorno il nuovo display in base a quello corrente
                setDisplayTime((prev_display) => {    
                    let new_display = { ...prev_display };  //copio i singoli elementi senza referenziare
                    if (new_display.seconds && new_display.seconds > 0) {
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
                        
                        if(!isStudying){
                            decrementaCicli();
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
        // data_update();
        setDisplayTime(isStudying ? { ...studioTime } : { ...riposoTime });
    };

    //funzione per saltare alla fase successiva
    const skip = () => {
        // data_update();
        if (!isRunning) {
            setIsStudying(!isStudying);
            setDisplayTime(isStudying ? { ...riposoTime } : { ...studioTime });
            if(!isStudying){
                decrementaCicli();
                console.log(cicliRimanenti);
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
        let hours = time.hours > 0 ? `${ out_cifre(time.hours) }:` : '';
        return `${ hours }${out_cifre(time.minutes)}:${time.seconds ? out_cifre(time.seconds) : out_cifre(0)}`;
    };

    //cifre da numero a stringa con due caratteri
    const out_cifre = (n: number): string => {
        if(n<10)
            return '0' + n.toString();   
        else
            return n.toString();    
    }

    const backToCalendar = () =>{
        navigate("/calendar");
    }

    const newSession = () =>{
        location.state = undefined;
        setEventId(null);
        setStudioTime(toTime(30));
        setRiposoTime(toTime(5));
        setCicliRimanenti(5);
        setIsComplete(false);
        setDisplayTime(toTime(30));
    }

    if(isComplete){
        return(
            <>
                <p>This study session has been completed</p>
                <div>
                    {location.state && (    //se esiste location.state significa che si è acceduto al pomodoro tramite un evento sul calendario
                        <Button onClick={backToCalendar}>Go back to calendar</Button>
                    )}
                </div>
                <div>
                    <Button onClick={newSession}>Start a new session</Button>
                </div>
            </>
        )
    }
    else{
        return (
            <>
                <div>
                    <h1>{format_time(displayTime)}</h1>
                </div>
                <div>
                    <div>
                        <label>remaining cycles: {cicliRimanenti}</label>
                    </div>
                    <div>
                        {/* <button onClick={data_update}>Update</button> */}
                    </div>
                </div>
                    <p>{isStudying ? 'Studio' : 'Riposo'}</p>
                <div>
                    {!isRunning && (<button onClick={start}>Start</button>)}
                    {isRunning && (<button onClick={stop}>Stop</button>)}
                    <button onClick={reset}>Reset</button>
                    <button onClick={skip}>Skip</button>
                </div>
                {!location.state && (
                    <>
                        <button onClick={handleOpenSettings}>Settings</button>
                        {isSettingsOpen && (
                            <PomodoroSettings 
                                onClose={handleCloseSettings} 
                                onSave={handleSaveSetting} 
                                prevSetting= {{studioTime: toNum(studioTime), riposoTime: toNum(riposoTime), nCicli: cicliRimanenti, isComplete: isComplete}}
                            /> 
                        )}
                    </>
                )}

            </>
        );
    }
};
  
export default Pomodoro;  