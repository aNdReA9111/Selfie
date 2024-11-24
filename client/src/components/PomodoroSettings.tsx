import React from "react";
import { useState } from "react";
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

  // Funzione per gestire il cambiamento dei valori numerici
  const handleNumberChange = (field: string, value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setNewSetting({ ...newSetting, [field]: numericValue });
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">Pomodoro Settings</h3>
        <form>

          <div className="mb-3">
            <label htmlFor="study-time" className="form-label">
              <strong>Study Time (minutes)</strong>
            </label>
            <input
              type="number"
              id="study-time"
              className="form-control"
              value={newSetting.studioTime || ""} // Imposta "" se il valore è 0
              step={!isSuggested ? "5" : "1"}
              min="5"
              onChange={(e) =>
                handleNumberChange("studioTime", e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label htmlFor="rest-time" className="form-label">
              <strong>Rest Time (minutes)</strong>
            </label>
            <input
              type="number"
              id="rest-time"
              className="form-control"
              value={newSetting.riposoTime || ""} // Imposta "" se il valore è 0
              min="1"
              onChange={(e) =>
                handleNumberChange("riposoTime", e.target.value)
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cycles" className="form-label">
              <strong>Amount of Cycles</strong>
            </label>
            <input
              type="number"
              id="cycles"
              className="form-control"
              value={newSetting.nCicli || ""} // Imposta "" se il valore è 0
              min="1"
              onChange={(e) =>
                handleNumberChange("nCicli", e.target.value)
              }
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>
              Save
            </button>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleOpenSuggestion}
          >
            Generate Settings
          </button>
          {isSuggestionOpen && (
            <PomSuggestion onClose={handleCloseSuggestion} onSave={handleSaveSuggestion} />
          )}
        </div>
      </div>
    </div>
  );
};
