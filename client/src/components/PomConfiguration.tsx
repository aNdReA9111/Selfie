import Button from 'react-bootstrap/Button';
import { PomodoroSetting } from '../utils/types';

interface PomConfigurationProps {
    pomodoroSetting: PomodoroSetting;
    navigateToPomodoro: () => void;
}

export const PomConfiguration: React.FC<PomConfigurationProps> = ({ pomodoroSetting, navigateToPomodoro }: PomConfigurationProps) => {
    return (
        <>
            {(pomodoroSetting.nCicli > 0) && (
                <div className="p-3 rounded border bg-light">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col">
                                <i className="bi bi-clock-fill text-primary fs-3"></i>
                                <p className="mb-1">Study time</p>
                                <p className="fs-5 fw-bold">{pomodoroSetting.studioTime}'</p>
                            </div>
                            <div className="col">
                                <i className="bi bi-pause-circle-fill text-success fs-3"></i>
                                <p className="mb-1">Rest time</p>
                                <p className="fs-5 fw-bold">{pomodoroSetting.riposoTime}'</p>
                            </div>
                            <div className="col">
                                <span className="fs-3">&#x21bb;</span>
                                {/* <i className="bi bi-arrow-repeat text-warning fs-3"></i> */}
                                <p className="mb-1">Remaining cycles</p>
                                <p className="fs-5 fw-bold">{pomodoroSetting.nCicli}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <Button variant="primary" onClick={navigateToPomodoro}>Open Pomodoro App</Button>
                    </div>
                </div>
            )}
            {(pomodoroSetting.nCicli <= 0) && (
                <p className="fs-5 fw-bold">This study session has been completed</p>
            )}
        </>
    );
};
