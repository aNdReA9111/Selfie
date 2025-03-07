import React, { useEffect, useState } from 'react';
import { PomodoroSetting } from '../utils/types';
import { generateSettings, Time, toTime, toNum } from '../utils/pomUtils';

interface Props {
	onSave: (newSetting: PomodoroSetting, tempoDisponibile: number) => void; 
	onClose: () => void;
	duration?: number | null;
}

export const PomSuggestion: React.FC<Props> = ({onSave, onClose, duration}) => {
	const [tempoDisp, setTempoDisp] = useState<Time>(duration ? toTime(duration) : toTime(60));
	const [suggestions, setSuggestions] = useState(generateSettings(toNum(tempoDisp)));
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
	
	useEffect(() => {
		setSuggestions(generateSettings(toNum(tempoDisp)));
	}, [tempoDisp])
	
	const handleSaveClick = (event: React.FormEvent) => {
		event.preventDefault(); 
		if(selectedOption !== null){
			onSave(suggestions[selectedOption], toNum(tempoDisp));
		}
		else{
			setIsOptionSelected(true);
		}
	};
	
	useEffect(()=>{
		setSelectedOption(null);
	}, [tempoDisp])
	
	return (
		<div className = 'd-flex align-items-center justify-content-center ' style ={{ marginTop: 0, paddingTop: 0 }}>
			<div className="d-flex color-6 rounded flex-column align-items-center justify-content-center mw-100" style={{ minWidth:"400px" , padding: "15px"}}>
				<div className="d-flex flex-column">
					<h5 className="mb-3 mt-3">Set total session duration</h5>
					<div className="d-flex mb-4 justify-content-center align-items-center gap-3">
						<div>
							<label className="mb-1"><strong>Hours</strong></label>
							<input
								type="number"
								className="form-control"
								min="0" max="99"
								value={tempoDisp.hours}
								onChange={(e) => setTempoDisp({ ...tempoDisp, hours: parseInt(e.target.value, 10) || 0 } ) }
							/>
						</div>
						<span className="fs-4"> : </span>
						<div>
							<label className="mb-1"><strong>Minutes</strong></label>
							<input
								type="number"
								className="form-control"
								min="0" max="59"
								value={tempoDisp.minutes}
								onChange={ (e) => setTempoDisp( {...tempoDisp, minutes: parseInt(e.target.value, 10) || 0 } ) }
							/>
						</div>
					</div>
				</div>
				<div className="d-flex flex-wrap justify-content-center gap-3">
					{suggestions.map((option, index) => (
						<div key={index} className={selectedOption === index ? "card-selected" : "card-pm"} onClick={() => setSelectedOption(index)}>
							<div className="d-flex mt-2 text-center align-items-center justify-content-center">
								<div className="flex-grow-1">
									<div className="mb-2">
										<h5 className="text-primary mb-1"><strong>{option.studioTime}'</strong></h5>
										<p className="text-muted small mb-0">Study</p>
									</div>
									<div>
										<h5 className="text-success mb-1"><strong>{option.riposoTime}'</strong></h5>
										<p className="text-muted small mb-0">Rest</p>
									</div>
								</div>
								<div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "50%"}}>
									<div className="cycles-arrow d-flex align-items-center justify-content-center">
										<span className="fw-bold fs-4 color-text-2">{option.nCicli}</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="text-center mt-3">
					{isOptionSelected && ( <p className="fw-bold color-text">Select an option before saving</p> )}
				</div>
				<div className="d-flex justify-content-center mt-2 mb-4" style={{ width: "100%", maxWidth: "600px" }}>
					<button className="btn btn-secondary me-2" onClick={onClose}>Close</button>
					<button className="btn btn-primary color-4" onClick={handleSaveClick}>Use selected settings</button>
				</div>
			</div>
		</div>
	);
};