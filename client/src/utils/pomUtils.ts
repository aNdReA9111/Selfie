import { PomodoroSetting } from "./types";

export type Time = {
    seconds?: number;
    minutes: number;
    hours: number;
};
export function toTime(min:number): Time {
    return {
        hours: Math.floor(min/60), minutes: min%60, seconds: 0
    };
};
export function toNum(t:Time): number{
    return(t.minutes + t.hours*60)
};

//funzione che dato un tempo genera un array di divisori possibilmente con resto 0, altrimenti con resto molto basso
function generateDivision(tempoDisp : number, tollerance: number = 0, out: number[] = []) : number[] {
    let div = 2;    //minimo 2 cicli in una proprosta di studio
    while(tempoDisp/div>20){    //minimo 20 min totali in un ciclo
      if(tempoDisp%div == tollerance)
        out.push(div);
      div++;
    }
    if(tollerance >=5 || out.length>=3){
      return(out);
    }
    else{
      return(generateDivision(tempoDisp, tollerance+1, out));
    }
}

//funzione che genera delle proposte di impostazioni di studio in base al tempo a disposizione
export function generateSettings(tempoDisp: number): PomodoroSetting[] {
    let arrayCicli: number[] = generateDivision(tempoDisp);
    let out : PomodoroSetting[] = [];
    for(const i in arrayCicli){
        let tempoCiclo = Math.round(tempoDisp/arrayCicli[i]);
        let studio = Math.round((tempoCiclo/100) *85); //85% la percentuale di studio sul tempo di un ciclo proposta di default
        let x: PomodoroSetting = {studioTime: studio, riposoTime: (tempoCiclo-studio), nCicli: arrayCicli[i], isComplete: false}
        out.push(x);
    }
    return out;
}