import categories from "@/data/categories.json";


export type CategoryName = keyof typeof categories;

export type CategoryEntry = { word: string; hints: string[] };

export type GameConfig = {
  players: string[];
  category: CategoryName;
  impostorCount: number;
  totalSeconds: number;
  revealSeconds: number;
};

export type PlayerRole = "civilian" | "impostor";

export type PlayerState = {
  name: string;
  role: PlayerRole;
  shownText: string; // palabra o pista
  eliminated: boolean;
};

export type GameState = {
  config: GameConfig;
  secretWord: string;
  players: PlayerState[];
  startedAt: number; // Date.now()
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getCategoryNames(): CategoryName[] {
  return Object.keys(categories) as CategoryName[];
}

export function createGameState(config: GameConfig): GameState {
  if (config.players.length < 3) throw new Error("Necesitas al menos 3 jugadores.");
  if (config.impostorCount < 1) throw new Error("Debe haber al menos 1 impostor.");
  if (config.impostorCount >= config.players.length)
    throw new Error("Los impostores deben ser menos que el total de jugadores.");

  const entries = categories[config.category] as CategoryEntry[];
  const chosen = pickRandom(entries);
  const secretWord = chosen.word;
  const hint = pickRandom(chosen.hints);

  const shuffled = shuffle(config.players);
  const impostors = new Set(shuffled.slice(0, config.impostorCount));

  const players: PlayerState[] = config.players.map((name) => {
    const role: PlayerRole = impostors.has(name) ? "impostor" : "civilian";
    return {
      name,
      role,
      shownText: role === "impostor" ? `PISTA: ${hint}` : secretWord,
      eliminated: false,
    };
  });

  return {
    config,
    secretWord,
    players,
    startedAt: Date.now(),
  };
}

export function remainingImpostors(gs: GameState): number {
  return gs.players.filter((p) => p.role === "impostor" && !p.eliminated).length;
}

export function remainingCivilians(gs: GameState): number {
  return gs.players.filter((p) => p.role === "civilian" && !p.eliminated).length;
}

export function civiliansAlive(gs: GameState): number {
  return gs.players.filter((p) => p.role === "civilian" && !p.eliminated).length;
}
export function impostorsAlive(gs: GameState): number {
  return gs.players.filter((p) => p.role === "impostor" && !p.eliminated).length;
}
