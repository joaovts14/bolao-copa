"use client";
import { useMemo, useState } from "react";
import { buildSchedule } from "@/lib/schedule";
import { loadPicks, loadResults } from "@/lib/picks";
import { totalScore } from "@/lib/scoring";

export default function RankingPage() {
  const [stage, setStage] = useState<'ALL'|'GROUP'|'R32'|'R16'|'QF'|'SF'|'BRONZE'|'FINAL'>('ALL');

  const all = useMemo(()=>buildSchedule(), []);
  const picks = useMemo(()=>loadPicks(), []);
  const results = useMemo(()=>loadResults(), []);

  const filteredIds = useMemo(()=>{
    if (stage==='ALL') return new Set(all.map(m=>m.id));
    return new Set(all.filter(m=>m.stage===stage).map(m=>m.id));
  }, [stage, all]);

  const filteredPicks = useMemo(()=>{
    const o: any = {};
    Object.values(picks).forEach((p:any)=>{
      if (filteredIds.has(p.matchId)) o[p.matchId] = p;
    });
    return o;
  }, [picks, filteredIds]);

  const filteredResults = useMemo(()=>{
    const o: any = {};
    Object.values(results).forEach((r:any)=>{
      if (filteredIds.has(r.matchId)) o[r.matchId] = r;
    });
    return o;
  }, [results, filteredIds]);

  const { total, breakdown } = useMemo(()=>totalScore(filteredPicks as any, filteredResults as any), [filteredPicks, filteredResults]);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Minha Pontuação</h1>
          <nav className="flex flex-wrap gap-2">
            {(['ALL','GROUP','R32','R16','QF','SF','BRONZE','FINAL'] as const).map(s=>(
              <button key={s} onClick={()=>setStage(s)}
                className={`rounded-lg px-3 py-1 border ${stage===s?"bg-black text-white":"bg-white"}`}>
                {s}
              </button>
            ))}
          </nav>
        </header>
        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-lg">Total: <span className="font-bold">{total}</span> pontos</p>
          <ul className="mt-4 space-y-1 text-sm">
            {breakdown.map(b=> (
              <li key={b.matchId} className="flex items-center justify-between border-b pb-1">
                <span>{b.matchId}</span>
                <span>{b.points} ({b.reason})</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-gray-600">Regras: 3 pontos acerto exato, 2 pontos vencedor+saldo, 1 ponto só o vencedor.</p>
      </div>
    </main>
  );
}
