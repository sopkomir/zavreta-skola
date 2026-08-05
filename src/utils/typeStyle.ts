// Farebné a textové mapovanie typov námetov na "štítok" kartotékového lístka.
// Bez emoji - na katalógovom štítku pôsobí čistý text profesionálnejšie.
export const TYPE_STYLES: Record<string, { bg: string; label: string }> = {
  'AUDIO/VIDEO': { bg: 'bg-zosit', label: 'Video' },
  HRA: { bg: 'bg-marker', label: 'Hra' },
  APPKA: { bg: 'bg-gridblue', label: 'Appka' },
  WEBKA: { bg: 'bg-gridblue', label: 'Webka' },
  CVIKA: { bg: 'bg-chalkboard', label: 'Cvika' },
  NÁVOD: { bg: 'bg-chalkboard', label: 'Návod' },
  PRINT: { bg: 'bg-ink', label: 'Print' },
};

export function primaryTypeStyle(types: string[]) {
  for (const t of types) {
    if (TYPE_STYLES[t]) return TYPE_STYLES[t];
  }
  return { bg: 'bg-ink', label: types[0] || '' };
}