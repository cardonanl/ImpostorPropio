"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createGameState, getCategoryNames, type CategoryName } from "@/lib/game";
import {
  saveGameState,
  clearGameState,
  loadLastPlayersText,
  saveLastPlayersText,
} from "@/lib/storage";

export default function Home() {
  const router = useRouter();

  const categories = useMemo(() => getCategoryNames(), []);
  const [playersText, setPlayersText] = useState("");

  useEffect(() => {
    const last = loadLastPlayersText();
    setPlayersText(last || "Valentina\nNicolas\nRamon");
  }, []);

  const [category, setCategory] = useState<CategoryName>(categories[0]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [minutes, setMinutes] = useState(6);
  const [revealSeconds, setRevealSeconds] = useState(6);
  const [error, setError] = useState<string | null>(null);

  function start() {
    setError(null);

    const players = playersText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      clearGameState();

      const gs = createGameState({
        players,
        category,
        impostorCount: Number(impostorCount),
        totalSeconds: Number(minutes) * 60,
        revealSeconds: Number(revealSeconds),
      });

      saveLastPlayersText(playersText);
      saveGameState(gs);
      router.push("/reveal");
    } catch (e: any) {
      setError(e?.message ?? "Error creando el juego");
    }
  }

  return (
    <main className="win">
      <div className="titlebar">
        <div>El Impostor V2 Millenials</div>
        <small>MVP</small>
      </div>

      <div className="content">

        <div className="app-header">
          <img src="/icons/user.png" width={32} />
          <img src="/icons/key.png" width={32} />
          <img src="/icons/info.png" width={32} />
        </div>

        <div className="ascii-title">
          <h1 className="pixel-font title-center">Impostor para tacaños</h1>
        </div>

        <p>Configura la partida y pasa el teléfono para revelar roles.</p>

        <div className="stack">
          <label>
            <div>Jugadores (1 por línea)</div>
            <textarea
              value={playersText}
              onChange={(e) => setPlayersText(e.target.value)}
              rows={6}
            />
          </label>

          <label>
            <div>Categoría</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryName)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="row">
            <label>
              <div># Impostores</div>
              <input
                type="number"
                min={1}
                value={impostorCount}
                onChange={(e) => setImpostorCount(Number(e.target.value))}
              />
            </label>

            <label>
              <div>Tiempo total (min)</div>
              <input
                type="number"
                min={1}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
            </label>
          </div>

          <label>
            <div>Segundos para ver rol</div>
            <input
              type="number"
              min={2}
              value={revealSeconds}
              onChange={(e) => setRevealSeconds(Number(e.target.value))}
            />
          </label>

          {error && <div className="panel">{error}</div>}

          <button onClick={start} className="btn primary">
            Crear partida
          </button>
        </div>
      </div>
    </main>
  );
}
