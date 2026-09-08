export const BRAZILIAN_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

export function splitNaturalidade(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return { city: "", state: "" };
  const match = raw.match(/^(.+?)\s*[\/-]\s*([A-Za-z]{2})$/);
  if (!match) return { city: raw, state: "" };
  return { city: match[1].trim(), state: match[2].toUpperCase() };
}

export function joinNaturalidade(city: string, state: string) {
  const c = city.trim();
  const s = state.trim().toUpperCase();
  return c && s ? `${c}/${s}` : c || s;
}
