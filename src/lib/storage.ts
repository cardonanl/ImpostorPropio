import type { GameState } from "@/lib/game";

const KEY = "impostor_game_state_v1";

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
