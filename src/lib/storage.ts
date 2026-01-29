import type { GameState } from "@/lib/game";

const KEY = "impostor_game_state_v1";

const LAST_PLAYERS_KEY = "impostor_last_players_v1";

export function saveGameState(gs: GameState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(gs));
}

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearGameState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function saveLastPlayersText(text: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_PLAYERS_KEY, text);
}

export function loadLastPlayersText(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LAST_PLAYERS_KEY) ?? "";
}