
"use client";
import { useMemo, useState } from "react";
import { buildSchedule, type Match } from "@/lib/schedule";
import { picksFor, savePick, type Pick, clearPicks, exportPicks, importPicks } from "@/lib/picks";

const all = buildSchedule();
const groups = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;

export default function PalpitesPage() {
  const [tab, setTab] = useState<(typeof groups)[number]>("A");

  const groupMatches: Match[] = useMemo(
    () => all.filter(m => m.stage==="GROUP" && m.group===tab),
    [tab]
  );
  const initial = useMemo(() => picksFor(groupMatches), [groupMatches]);
  const [picks, setPicks] = useState<Record<string, Pick>>(initial);

  function setGoal(matchId: string, side: "home"|"away", val: string) {
    const n = val === "" ? null : Math.max(0, Math.min(99, Number(val)));
    setPicks(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side==="home"?"homeGoals":"awayGoals"]: (Number.isFinite(n) ? n : null) }
    }));
  }

  function saveAll() {
    Object.values(picks).forEach(savePick);
    alert("Palpites salvos!");
  }

  function resetGroup() {
    const fresh = picksFor(groupMatches);
    setPicks(fresh);
  }

  function handleExport() {
    const data = exportPicks();
    navigator.clipboard.writeText(data).then(()=>{
      alert("JSON dos palpites copiado para a área de transferência.");
    });
  }
  function handleImport() {
    const json = prompt("Cole aqui o JSON dos palpites:");
    if (!json) return;
    try {
      importPicks(json);
      location.reload();
    } catch {
      alert("JSON inválido.");
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Palpites — Fase de Grupos</h1>
          <div className="flex flex-wrap gap-2">
            <button onClick={saveAll} className="rounded-xl bg-black px-4 py-2 text-white">Salvar</button>
            <button onClick={resetGroup} className="rounded-xl border px-4 py-2">Limpar Grupo</button>
            <button onClick={() => { if(confirm("Apagar todos os palpites?")) { clearPicks(); location.reload(); } }}
                    className="rounded-xl border px-4 py-2">Zerar Tudo</button>
            <button onClick={handleExport} className="rounded-xl border px-4 py-2">Exportar JSON</button>
            <button onClick={handleImport} className="rounded-xl border px-4 py-2">Importar JSON</button>
          </div>
        </header>

        <nav className="mb-4 flex flex-wrap gap-2">
          {groups.map(g=>(
            <button key={g}
              onClick={()=>setTab(g)}
              className={`rounded-lg px-3 py-1 border ${tab===g?"bg-black text-white":"bg-white"}`}>
              Grupo {g}
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
              {groupMatches.map((m)=>{
                const now = Date.now();
                const locked = m.kickoff ? now > new Date(m.kickoff).getTime() : false;
                return (
                <tr key={m.id} className="odd:bg-gray-50 align-middle">
                  <td className="p-3 border-b">{m.id}</td>
                  <td className="p-3 border-b">{m.home}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-14 rounded border p-1 text-center disabled:bg-gray-100"
                        value={picks[m.id]?.homeGoals ?? ""}
                        onChange={(e)=>setGoal(m.id,"home",e.target.value.replace(/\D/g,""))}
                        placeholder="0"
                        disabled={locked}
                        title={locked ? "Jogo bloqueado (já começou)" : ""}
                      />
                      <span className="text-gray-500">x</span>
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-14 rounded border p-1 text-center disabled:bg-gray-100"
                        value={picks[m.id]?.awayGoals ?? ""}
                        onChange={(e)=>setGoal(m.id,"away",e.target.value.replace(/\D/g,""))}
                        placeholder="0"
                        disabled={locked}
                        title={locked ? "Jogo bloqueado (já começou)" : ""}
                      />
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

        <p className="mt-4 text-sm text-gray-600">
          Times reais serão preenchidos após o sorteio. Datas e locais são placeholders e podem ser atualizados.
        </p>
      </div>
    </main>
  );
}
