// src/lib/scoring.ts
import type { Pick, Result } from "./picks";

export type ScoreBreakdown = {
  matchId: string;
  points: number;
  reason: 'EXACT'|'DIFF'|'WINNER'|'NONE';
};

export function winner(h: number, a: number): 1|0|-1 {
  if (h > a) return 1;
  if (h < a) return -1;
  return 0;
}

export function scorePick(p: Pick, r?: Result): ScoreBreakdown {
  if (!p || p.homeGoals==null || p.awayGoals==null || !r) {
    return { matchId: p?.matchId || 'unknown', points: 0, reason: 'NONE' };
  }
  const ph = p.homeGoals!, pa = p.awayGoals!;
  const rw = winner(r.homeGoals, r.awayGoals);
  const pw = winner(ph, pa);

  if (ph === r.homeGoals && pa === r.awayGoals) {
    return { matchId: p.matchId, points: 3, reason: 'EXACT' };
  }
  if (pw === rw && (ph - pa) === (r.homeGoals - r.awayGoals)) {
    return { matchId: p.matchId, points: 2, reason: 'DIFF' };
  }
  if (pw === rw) {
    return { matchId: p.matchId, points: 1, reason: 'WINNER' };
  }
  return { matchId: p.matchId, points: 0, reason: 'NONE' };
}

export function totalScore(picks: Record<string, Pick>, results: Record<string, Result>) {
  const items = Object.values(picks);
  let total = 0;
  const breakdown: ScoreBreakdown[] = [];
  for (const p of items) {
    const r = results[p.matchId];
    const s = scorePick(p, r);
    breakdown.push(s);
    total += s.points;
  }
  return { total, breakdown };
}
