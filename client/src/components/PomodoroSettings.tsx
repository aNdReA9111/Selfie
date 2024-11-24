import React, { useState } from "react";
import { PomodoroSetting } from '../utils/types';
import { PomSuggestion } from "./PomSuggestion";


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

    return (
        <div>
            <div>
                <div>
                    <h3>Study time</h3>
                    <input
                        type="number"
                        value={newSetting.studioTime}
                        step={!isSuggested ? "5" : "1"}
                        min="5"
                        onChange={
                            (studio) => setNewSetting({ ...newSetting, studioTime: (Number(studio.target.value)) })}
                    />
                </div>
                <div>
                    <h3>Rest time</h3>
                    <input
                        type="number"
                        value={newSetting.riposoTime}
                        min="1"
                        onChange={(riposo) => setNewSetting({ ...newSetting, riposoTime: (Number(riposo.target.value)) })}
                    />
                </div>
                <div>
                    <h3>Amount of cycles</h3>
                    <input
                        type="number"
                        value={newSetting.nCicli}
                        min="1"
                        onChange={(cicli) => setNewSetting({ ...newSetting, nCicli: (Number(cicli.target.value)) })}
                    />
                </div>
                <div>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
                <div>
                    <button onClick={handleOpenSuggestion}>Settings generator</button>
                    {isSuggestionOpen && (
                        <PomSuggestion
                            onClose={handleCloseSuggestion}
                            onSave={handleSaveSuggestion}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
