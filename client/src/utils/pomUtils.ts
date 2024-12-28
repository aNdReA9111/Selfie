import { PomodoroSetting } from "./types";

export type Time = {
    seconds?: number;
    minutes: number;
    hours: number;
};
export function toTime(min: number): Time {
    return {
        hours: Math.floor(min / 60), minutes: min % 60, seconds: 0
    };
};
export function toNum(t: Time): number {
    return ((t.seconds ? t.seconds : 0) / 60 + t.minutes + t.hours * 60)
};

//funzione per visualizzazione timer
export function formatTime(time: Time): string {
    let hours = time.hours > 0 ? `${outCifre(time.hours)}:` : '';
    return `${hours}${outCifre(time.minutes)}:${time.seconds ? outCifre(time.seconds) : outCifre(0)}`;
};


//cifre da numero a stringa con due caratteri
export function outCifre(n: number): string {
    if (n < 10)
        return '0' + n.toString();
    else
        return n.toString();
}

//funzione che dato un tempo genera un array di divisori possibilmente con resto 0, altrimenti con resto molto basso
function generateDivision(tempoDisp: number, tollerance: number = 0, out: number[] = []): number[] {
    let div = 2;    //minimo 2 cicli in una proprosta di studio
    while (tempoDisp / div >= 20) {    //minimo 20 min totali in un ciclo
        if (tempoDisp % div == tollerance)
            out.push(div);
        div++;
    }
    if (tollerance >= 5 || out.length >= 4) {	//massimo 5 min in piu o in meno rispetto al tempo selezionato
        return (out);
    }
    else {
        return (generateDivision(tempoDisp, tollerance + 1, out));
    }
}

//funzione che genera delle proposte di impostazioni di studio in base al tempo a disposizione
export function generateSettings(tempoDisp: number): PomodoroSetting[] {
    let arrayCicli: number[] = generateDivision(tempoDisp);
    let out: PomodoroSetting[] = [];
    for (const i in arrayCicli) {
        let tempoCiclo = Math.round(tempoDisp / arrayCicli[i]);
        let studio = Math.round((tempoCiclo / 100) * 85); //85% la percentuale di studio sul tempo di un ciclo proposta di default
        let x: PomodoroSetting = { studioTime: studio, riposoTime: (tempoCiclo - studio), nCicli: arrayCicli[i], isComplete: false }
        out.push(x);
    }
    return out;
}
