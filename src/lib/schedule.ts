// src/lib/schedule.ts
export type Stage = 'GROUP'|'R32'|'R16'|'QF'|'SF'|'BRONZE'|'FINAL';
export type GroupKey = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L';
export type TeamSlot = `${GroupKey}${1|2|3|4}`;

export type Match = {
  id: string;           // ex: "A-1", "B-4", "R32-7"
  stage: Stage;
  group?: GroupKey;
  home: string;         // "A1", "A2" ... ou "TBD" nos mata-matas
  away: string;
  kickoff?: string;     // ISO string
  venue?: string;       // Nome do estádio ou cidade
};

export const groups: GroupKey[] = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// Gera 6 jogos para cada grupo (round-robin)
function groupMatches(g: GroupKey): Match[] {
  const t1 = `${g}1`, t2 = `${g}2`, t3 = `${g}3`, t4 = `${g}4`;
  const pairs: [string,string][] = [
    [t1,t2],[t3,t4],[t1,t3],[t2,t4],[t1,t4],[t2,t3]
  ];
  return pairs.map((p, idx) => ({
    id: `${g}-${idx+1}`,
    stage: 'GROUP',
    group: g,
    home: p[0],
    away: p[1],
    // Placeholders de data/venue (ajuste depois conforme grade oficial)
    kickoff: placeholderKickoff(g, idx),
    venue: placeholderVenue(g, idx),
  }));
}

function allGroupStage(): Match[] {
  return groups.flatMap(groupMatches);
}

// Mata-mata placeholders (serão conectados após a classificação real)
function knockoutPlaceholders(): Match[] {
  const r32: Match[] = Array.from({length:16}, (_,i)=>({
    id:`R32-${i+1}`, stage:'R32', home:`TBD`, away:`TBD`,
    kickoff: placeholderKO('R32', i), venue: 'TBD'
  }));
  const r16: Match[] = Array.from({length:8}, (_,i)=>({
    id:`R16-${i+1}`, stage:'R16', home:`TBD`, away:`TBD`,
    kickoff: placeholderKO('R16', i), venue: 'TBD'
  }));
  const qf: Match[]  = Array.from({length:4}, (_,i)=>({
    id:`QF-${i+1}`, stage:'QF',  home:`TBD`, away:`TBD`,
    kickoff: placeholderKO('QF', i), venue: 'TBD'
  }));
  const sf: Match[]  = Array.from({length:2}, (_,i)=>({
    id:`SF-${i+1}`, stage:'SF',  home:`TBD`, away:`TBD`,
    kickoff: placeholderKO('SF', i), venue: 'TBD'
  }));
  const bronze: Match = { id:'BRONZE', stage:'BRONZE', home:'TBD', away:'TBD', kickoff: placeholderKO('BRONZE',0), venue:'TBD' };
  const final:  Match = { id:'FINAL',  stage:'FINAL',  home:'TBD', away:'TBD', kickoff: placeholderKO('FINAL',0), venue:'MetLife Stadium (TBC)' };
  return [...r32, ...r16, ...qf, ...sf, bronze, final];
}

// Placeholders simples para datas
// Distribui partidas entre 2026-06-11 e 2026-07-19 em horários genéricos
function placeholderKickoff(group: GroupKey, idx: number): string {
  // Datas fictícias coerentes
  // Cada grupo começa em 2026-06-12 + offset baseado no grupo
  const base = new Date(Date.UTC(2026, 5, 12 + (group.charCodeAt(0) - 'A'.charCodeAt(0)), 18, 0, 0));
  base.setUTCDate(base.getUTCDate() + Math.floor(idx/2)); // cada 2 jogos, dia seguinte
  return base.toISOString();
}

function placeholderVenue(group: GroupKey, idx: number): string {
  const venues = [
    'Estadio Azteca (MEX)',
    'Los Angeles (USA)',
    'Toronto (CAN)',
    'New York / New Jersey (USA)',
    'Dallas (USA)',
    'Vancouver (CAN)',
  ];
  return venues[(group.charCodeAt(0) + idx) % venues.length];
}

function placeholderKO(stage: Stage, idx: number): string {
  const startMap: Record<Stage, [number, number, number]> = {
    GROUP: [2026,6,12],
    R32: [2026,6,29],
    R16: [2026,7,6],
    QF:  [2026,7,12],
    SF:  [2026,7,16],
    BRONZE:[2026,7,18],
    FINAL:[2026,7,19],
  };
  const [y,m,d] = startMap[stage];
  const base = new Date(Date.UTC(y, m-1, d, 19, 0, 0));
  base.setUTCDate(base.getUTCDate() + Math.floor(idx/2));
  return base.toISOString();
}

export function buildSchedule(): Match[] {
  return [...allGroupStage(), ...knockoutPlaceholders()];
}