import type { GameState } from "@/lib/game";

const KEY = "impostor_game_state_v1";

export function saveGameState(gs: GameState) {
  localStorage.setItem(KEY, JSON.stringify(gs));
}

export function loadGameState(): GameState | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(KEY);
}
