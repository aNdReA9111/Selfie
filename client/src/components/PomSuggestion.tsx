import React, { useEffect, useState } from 'react';
import { PomodoroSetting } from '../utils/types';
import { generateSettings } from '../utils/pomUtils';

interface Props {
    onSave: (newSetting: PomodoroSetting, tempoDisponibile: number) => void; 
    onClose: () => void;
    duration?: number | null;
}

export const PomSuggestion: React.FC<Props> = ({onSave, onClose, duration}) => {
    const [tempoDisp, setTempoDisp] = useState(duration ? duration : 60);
    const [suggestions, setSuggestions] = useState(generateSettings(tempoDisp));
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        setSuggestions(generateSettings(tempoDisp));
    }, [tempoDisp])


    const handleSaveClick = (event: React.FormEvent) => {
        event.preventDefault(); 
        if(selectedOption !== null){
            onSave(suggestions[selectedOption], tempoDisp);
        }
        else{
            alert('select an option before saving.');
        }
    };
    return (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Session Suggestion</h3>
    
            {/* Input Durata */}
            <div className="mb-4">
              <label htmlFor="tempo-disp" className="form-label">
                <strong>Total Session Duration (minutes)</strong>
              </label>
              <input
                type="number"
                id="tempo-disp"
                className="form-control"
                value={tempoDisp}
                step="5"
                min="5"
                onChange={(e) => setTempoDisp(parseInt(e.target.value, 10))}
              />
            </div>
    
            {/* Griglia delle Opzioni */}
            <div className="row g-3">
              {suggestions.map((option, index) => (
                <div key={index} className="col-md-6">
                  <div
                    className={`card ${
                      selectedOption === index ? "border-primary" : ""
                    }`}
                  >
                    <div className="card-body">
                      <h5 className="card-title">Option {index + 1}</h5>
                      <ul className="list-unstyled">
                        <li>
                          <strong>Study Time:</strong> {option.studioTime} minutes
                        </li>
                        <li>
                          <strong>Rest Time:</strong> {option.riposoTime} minutes
                        </li>
                        <li>
                          <strong>Cycles:</strong> {option.nCicli}
                        </li>
                      </ul>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`option-${index}`}
                          name="suggestions"
                          value={index}
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`option-${index}`}
                        >
                          Select this option
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
    
            {/* Bottoni di Azione */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSaveClick}
              >
                Use this setting
              </button>
            </div>
          </div>
        </div>
      );
    };