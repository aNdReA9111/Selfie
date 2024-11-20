import React, { useEffect, useState } from 'react';
import { PomodoroSetting } from '../utils/types';
import { generateSettings } from '../utils/pomUtils';

interface Props {
    onSave: (newSetting: PomodoroSetting) => void; 
    onClose: () => void;
}

export const PomSuggestion: React.FC<Props> = ({onSave, onClose}) => {
    const [tempoDisp, setTempoDisp] = useState(60);
    const [suggestions, setSuggestions] = useState(generateSettings(tempoDisp));
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        setSuggestions(generateSettings(tempoDisp));
    }, [tempoDisp])


    const handleSaveClick = (event: React.FormEvent) => {
        event.preventDefault(); // Previene il comportamento predefinito del form
        if(selectedOption !== null){
            onSave(suggestions[selectedOption]);
        }
        else{
            alert('select an option before saving.');
        }
    };

    return (
        <form>
            <div>
                <p>How long do you want your session to last?</p>
                <input
                    type="number"
                    value={tempoDisp}
                    step = "5"
                    min = "5"
                    onChange={(e) => setTempoDisp(parseInt(e.target.value, 10))}
                />
            </div>
            <div>
                {suggestions.map((option, index) => (
                    <div key={index}>
                    <input
                        type="radio"
                        name="options"
                        id={`option-${index}`}
                        value={index}
                        checked={selectedOption === index}
                        onChange={() => setSelectedOption(index)}
                    />
                    <label htmlFor={`option-${index}`}>{JSON.stringify(option, null, 2)}</label>
                    </div>
                ))}
            </div>
            <div>
                <button type="button" onClick={onClose} style={{ marginRight: '10px' }}>Close</button>
                <button type="submit" onClick={handleSaveClick}>Use this setting</button>
            </div>
        </form>
    );
};
