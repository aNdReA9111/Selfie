import React from "react";
import { useState } from "react";


// export const PomodoroSettings = ({studio, setStudio, riposo, setRiposo, nCicli}) => {
//     const [newStudio, setNewStudio] = useState(studio);
//     const [newRiposo, setNewRiposo] = useState(studio);

//     const onSave = () => {
//         setStudio(newStudio);
//         setRiposo(newRiposo);
//     }
//     return(
//         <>
//             <div>
//                 <label>
//                     Study time:
//                     <input value = {newStudio} type="number" step="5" onChange={(e) => setNewStudio(e.target.value)} defaultValue={studio}/>
//                 </label>
//             </div>
//             <div>
//                 <label>
//                     Rest time:
//                     <input type="number" defaultValue={riposo}/>
//                 </label>
//             </div>
//             <div>
//                 <label>
//                     cicli
//                     <input  type="number" defaultValue={nCicli}/>
//                 </label>
//                 <button onClick={onSave}>Salva</button>
//             </div>
//         </>
//     )
// }

interface SettingsProps {
    onSave: (data: string) => number; // Una funzione che accetta una stringa e restituisce un numero
}

export const PomodoroSettings: React.FC<SettingsProps> = ({ onClose, onSave, studio}) => {
  const [newStudio, setNewStudio] = useState(studio);

  const handleSaveClick = () => {
    onSave(newStudio); // Passa il valore aggiornato al componente genitore
  };

  return (
    <div>
      <div style={styles.modal}>
        <h2>Modifica il parametro</h2>
        <input
          type="text"
          value={newStudio}
          onChange={(e) => setNewStudio(e.target.value)}
        />
        <div style={styles.buttons}>
          <button onClick={handleSaveClick}>Salva</button>
          <button onClick={onClose}>Annulla</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
};

