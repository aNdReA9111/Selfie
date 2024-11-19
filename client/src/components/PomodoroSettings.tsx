import React from "react";
import { useState } from "react";
import { Time, toTime, toNum, generateSettings} from '../utils/pomUtils'
import { PomodoroSetting } from '../utils/types';
import { PomSuggestion } from "./PomSuggestion";


interface SettingsProps {
    onSave: (newSetting: PomodoroSetting) => void; 
    onClose: () => void;
    prevSetting: PomodoroSetting;
  }

export const PomodoroSettings: React.FC<SettingsProps> = ({ onClose, onSave, prevSetting}) => {
  const [newSetting, setNewSetting] = useState(prevSetting);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  const handleSaveClick = () => {
    onSave(newSetting);
  };

  const handleOpenSuggestion = () => setIsSuggestionOpen(true);
  const handleCloseSuggestion = () => setIsSuggestionOpen(false);

  const handleSaveSuggestion = (set : PomodoroSetting) => {
    onSave(set);
    handleCloseSuggestion; // Chiudi il modal dopo aver salvato
  };

  return (
    <div>
      <div>
        <div>
          <h3>Study time</h3>
          <input
            type="number"
            value={newSetting.studioTime}
            step = "5"
            min = "5"
            onChange={
              (e) => setNewSetting({
                studioTime:(e.target.value, 10), 
                riposoTime: newSetting.riposoTime, 
                nCicli: newSetting.nCicli, 
                isComplete: newSetting.isComplete
              })}
          />
        </div>
        <div>
          <h3>Rest time</h3>
          <input
            type="number"
            value={newSetting.riposoTime}
            min = "1"
            onChange={(e) => setNewSetting({
              studioTime:newSetting.studioTime, 
              riposoTime: (e.target.value, 10), 
              nCicli: newSetting.nCicli, 
              isComplete: newSetting.isComplete
            })}
          />
        </div>
        <div>
          <h3>Amount of cycles</h3>
          <input
            type="number"
            value={newSetting.nCicli}
            min = "1"
            onChange={(e) => setNewSetting({
              studioTime:newSetting.studioTime, 
              riposoTime:newSetting.riposoTime, 
              nCicli: (e.target.value, 10),
              isComplete: newSetting.isComplete
            })}
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
