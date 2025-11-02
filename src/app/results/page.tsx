"use client";
import { useMemo, useState } from "react";
import { buildSchedule, type Match } from "@/lib/schedule";
import { loadResults, saveResult, clearResults } from "@/lib/picks";

const all = buildSchedule();

const RESULTS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_RESULTS === "true";
export default function ResultsPage() {
  if (!RESULTS_ENABLED) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Resultados desativados</h1>
          <p className="text-gray-600">Defina <code>NEXT_PUBLIC_ENABLE_RESULTS=true</code> nas variáveis de ambiente para habilitar.</p>
        </div>
      </main>
    );
  }

  const [stage, setStage] = useState<'GROUP'|'R32'|'R16'|'QF'|'SF'|'BRONZE'|'FINAL'>('GROUP');

  const matches: Match[] = useMemo(
    () => all.filter(m => m.stage===stage),
    [stage]
  );

  const [vals, setVals] = useState<Record<string, {h:string, a:string}>>({});

  function setGoal(id: string, side: 'h'|'a', v: string) {
    setVals(prev => ({
      ...prev,
      [id]: { h: side==='h'? v.replace(/\D/g,"") : (prev[id]?.h ?? ""), a: side==='a'? v.replace(/\D/g,"") : (prev[id]?.a ?? "") }
    }));
  }

  function saveAll() {
    matches.forEach(m => {
      const v = vals[m.id];
      if (v && v.h !== "" && v.a !== "") {
        saveResult({ matchId: m.id, homeGoals: Number(v.h), awayGoals: Number(v.a) });
      }
    });
    alert("Resultados salvos!");
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resultados Oficiais (local)</h1>
          <div className="flex gap-2">
            <button onClick={saveAll} className="rounded-xl bg-black px-4 py-2 text-white">Salvar</button>
            <button onClick={() => { if(confirm("Apagar todos os resultados?")) { clearResults(); location.reload(); } }}
                    className="rounded-xl border px-4 py-2">Limpar Tudo</button>
          </div>
        </header>

        <nav className="mb-4 flex flex-wrap gap-2">
          {(['GROUP','R32','R16','QF','SF','BRONZE','FINAL'] as const).map(s=>(
            <button key={s}
              onClick={()=>setStage(s)}
              className={`rounded-lg px-3 py-1 border ${stage===s?"bg-black text-white":"bg-white"}`}>
              {s}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl bg-white shadow overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-3 border-b">Jogo</th>
                <th className="p-3 border-b">Casa</th>
                <th className="p-3 border-b">Placar</th>
                <th className="p-3 border-b">Fora</th>
                <th className="p-3 border-b">Data</th>
                <th className="p-3 border-b">Local</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m)=>{
                return (
                <tr key={m.id} className="odd:bg-gray-50">
                  <td className="p-3 border-b">{m.id}</td>
                  <td className="p-3 border-b">{m.home}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <input inputMode="numeric" pattern="[0-9]*" className="w-14 rounded border p-1 text-center"
                        value={vals[m.id]?.h ?? ""} onChange={(e)=>setGoal(m.id,'h',e.target.value)} placeholder="0" />
                      <span className="text-gray-500">x</span>
                      <input inputMode="numeric" pattern="[0-9]*" className="w-14 rounded border p-1 text-center"
                        value={vals[m.id]?.a ?? ""} onChange={(e)=>setGoal(m.id,'a',e.target.value)} placeholder="0" />
                    </div>
                  </td>
                  <td className="p-3 border-b">{m.away}</td>
                  <td className="p-3 border-b">{m.kickoff ? new Date(m.kickoff).toLocaleString() : "-"}</td>
                  <td className="p-3 border-b">{m.venue ?? "-"}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-600">Armazenamento local (localStorage). Em produção real, vamos trocar por banco.</p>
      </div>
    </main>
  );
}
