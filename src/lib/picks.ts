// src/lib/picks.ts
import type { Match } from "./schedule";

export type Pick = { matchId: string; homeGoals: number|null; awayGoals: number|null };
export type Result = { matchId: string; homeGoals: number; awayGoals: number };

const PICKS_KEY = "bolao_picks_2026";
const RESULTS_KEY = "bolao_results_2026";

export function loadPicks(): Record<string, Pick> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PICKS_KEY) || "{}"); } catch { return {}; }
}
export function savePick(p: Pick) {
  if (typeof window === "undefined") return;
  const all = loadPicks();
  all[p.matchId] = p;
  localStorage.setItem(PICKS_KEY, JSON.stringify(all));
}
export function clearPicks() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PICKS_KEY);
}
export function exportPicks(): string {
  if (typeof window === "undefined") return "{}";
  return localStorage.getItem(PICKS_KEY) || "{}";
}
export function importPicks(json: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PICKS_KEY, json);
}

export function picksFor(matches: Match[]): Record<string, Pick> {
  const all = loadPicks();
  const out: Record<string, Pick> = {};
  for (const m of matches) {
    out[m.id] = all[m.id] ?? { matchId:m.id, homeGoals:null, awayGoals:null };
  }
  return out;
}

export function loadResults(): Record<string, Result> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(RESULTS_KEY) || "{}"); } catch { return {}; }
}
export function saveResult(r: Result) {
  if (typeof window === "undefined") return;
  const all = loadResults();
  all[r.matchId] = r;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
}
export function clearResults() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESULTS_KEY);
}
