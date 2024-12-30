import React, { useEffect } from "react";
import { useState } from "react";
import { PomodoroSetting } from '../utils/types';
import { PomSuggestion } from "./PomSuggestion";
import './../css/pomodoro.css';

interface SettingsProps {
    onSave: (newSetting: PomodoroSetting) => void;
    onClose: () => void;
    prevSetting: PomodoroSetting;
}

export const PomodoroSettings: React.FC<SettingsProps> = ({ onClose, onSave, prevSetting }) => {
    const [newSetting, setNewSetting] = useState(prevSetting);
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const [isSuggested, setIsSuggested] = useState(false);

    const handleSaveClick = () => {
        onSave(newSetting);
    };

    const handleOpenSuggestion = () => setIsSuggestionOpen(true);
    const handleCloseSuggestion = () => setIsSuggestionOpen(false);

    const handleSaveSuggestion = (set: PomodoroSetting) => {
        setNewSetting(set);
        setIsSuggestionOpen(false);
        setIsSuggested(true);
    };

    const handleNumberChange = (field: string, value: string) => {
        const valueNum = Number(value);
        if (valueNum >= 0) {
            setNewSetting({ ...newSetting, [field]: valueNum });
        }
    };

    useEffect(() => {
        if (isSuggested) {
            handleSaveClick();
        }
    }, [isSuggested])

    return (
        <div className="d-flex color-6 rounded align-items-center text-center ">
            {!isSuggestionOpen && (
                <div className="d-flex-column mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="d-flex mt-4">
                        <div className="d-flex-column justify-content-center align-items-center">
                            <div className="text-center">
                                <i className="bi bi-clock-fill fs-3"></i>
                                <p className="mb-1 fw-bold">Study</p>
                                <div className="d-flex justify-content-center mt-3">
                                    <input
                                        type="number"
                                        className="form-control w-50 text-center"
                                        value={newSetting.studioTime || ""}
                                        step={!isSuggested ? "5" : "1"}
                                        min="5"
                                        onChange={(val) => handleNumberChange("studioTime", val.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex-column justify-content-center align-items-center">
                            <div className="text-center">
                                <i className="bi bi-pause-circle-fill fs-3"></i>
                                <p className="mb-1 fw-bold">Rest</p>
                                <div className="d-flex justify-content-center mt-3">
                                    <input
                                        type="number"
                                        className="form-control w-50 text-center"
                                        value={newSetting.riposoTime || ""}
                                        min="1"
                                        onChange={(val) => handleNumberChange("riposoTime", val.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex-column justify-content-center align-items-center">
                            <div className="text-center">
                                <span className="fs-3">&#x21bb;</span>
                                <p className="mb-1 fw-bold">Cycles</p>
                                <div className="d-flex justify-content-center mt-3">
                                    <input
                                        type="number"
                                        className="form-control w-50 text-center"
                                        value={newSetting.nCicli || ""}
                                        min="1"
                                        onChange={(val) => handleNumberChange("nCicli", val.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <button type="button" className="btn color-4 mx-2" onClick={handleSaveClick}>Save</button>
                        <button type="button" className="btn btn-secondary mx-2" onClick={onClose}>Cancel</button>
                    </div>

                    <div className="text-center mt-3 mb-4">
                        <button className="btn color-1" onClick={handleOpenSuggestion}>Generate Settings</button>
                    </div>
                </div>
            )}
            {isSuggestionOpen && (
                <PomSuggestion onClose={handleCloseSuggestion} onSave={handleSaveSuggestion} />
            )}
        </div>
    );
};
