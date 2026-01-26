"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGameState, saveGameState } from "@/lib/storage";

export default function Reveal() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const gs = useMemo(() => loadGameState(), []);
  const player = gs?.players[idx];

  useEffect(() => {
    if (!gs) router.push("/");
  }, [gs, router]);

  useEffect(() => {
    if (!revealed || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setRevealed(false);
      setSecondsLeft(null);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [revealed, secondsLeft]);

  if (!gs || !player) return null;

  function reveal() {
  if (!gs) return;
  setRevealed(true);
  setSecondsLeft(gs.config.revealSeconds);
}


  function next() {
  if (!gs) return;

  const nextIdx = idx + 1;
  if (nextIdx >= gs.players.length) {
    saveGameState(gs);
    router.push("/play");
    return;
  }

  setIdx(nextIdx);
  setRevealed(false);
  setSecondsLeft(null);
}


  return (
  <main className="win">
    <div className="titlebar">
      <div>El Impostor Version Windows 95 Millenials</div>
      <small>Revelado</small>
    </div>

    <div className="content">
      <h1>Revelado por turnos</h1>
      <p>
        Jugador {idx + 1} de {gs.players.length}
      </p>

      <div className="panel">
        <div><b>Turno de: {player.name}</b></div>

        {!revealed ? (
          <button onClick={reveal} className="btn primary" style={{ marginTop: 12 }}>
            Ver mi palabra / pista
          </button>
        ) : (
          <div className="stack" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{player.shownText}</div>
            <div>Se ocultará en: {secondsLeft}s</div>
          </div>
        )}

        <button
          onClick={next}
          disabled={revealed}
          className="btn"
          style={{ marginTop: 14 }}
        >
          Siguiente jugador
        </button>
      </div>
    </div>
  </main>
);
}
