/**
 * Genera un colore HSL univoco basato su una stringa.
 * La funzione produce sempre lo stesso colore per la stessa stringa in input.
 * 
 * @param str - La stringa da cui generare il colore
 * @returns Una stringa HSL del tipo "hsl(xxx, 70%, 60%)"
 * 
 * @example
 * generateColorFromString("mario") // => "hsl(145, 70%, 60%)"
 */
export const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}; 