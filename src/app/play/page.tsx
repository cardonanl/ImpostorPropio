"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGameState, saveGameState, clearGameState } from "@/lib/storage";
import { civiliansAlive, impostorsAlive } from "@/lib/game";

export default function Play() {
  const router = useRouter();
  const [gs, setGs] = useState(() => loadGameState());
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!gs) router.push("/");
  }, [gs, router]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  if (!gs) return null;

  // Timer
  const elapsed = Math.floor((now - gs.startedAt) / 1000);
  const remaining = Math.max(0, gs.config.totalSeconds - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  // Win conditions
  const iLeft = impostorsAlive(gs);
  const cLeft = civiliansAlive(gs);

  const impostorsWinNow = iLeft > 0 && iLeft >= cLeft; // parity win
  const civiliansWinNow = iLeft === 0;

  const gameOver = remaining <= 0 || impostorsWinNow || civiliansWinNow;

  function eliminate(name: string) {
  if (!gs || gameOver) return;

  const ok = window.confirm(`¿Estás seguro de que deseas eliminar a ${name}?`);
  if (!ok) return;

  const p = gs.players.find((x) => x.name === name);
  if (!p || p.eliminated) return;

  p.eliminated = true;
  saveGameState(gs);
  setGs({ ...gs });

  setToast(p.role === "impostor" ? `✅ ${name} ERA IMPOSTOR` : `❌ ${name} NO era impostor`);
  setTimeout(() => setToast(null), 2200);
}


  function reset() {
    const ok = window.confirm("¿Reiniciar y borrar la partida actual?");
    if (!ok) return;
    clearGameState();
    router.push("/");
  }

  const resultText = civiliansWinNow
    ? "✅ Ganaron los inocentes (impostores eliminados)."
    : impostorsWinNow
    ? "🕵️ Ganaron los impostores (igualaron/superaron a los inocentes)."
    : "🕵️ Ganaron los impostores (se acabó el tiempo).";

  return (
    <main className="win">
      <div className="titlebar">
        <div>El Impostor V2</div>
        <small>Jueguitop</small>
      </div>

      <div className="content">
        <h1>Hora de jugar, malo h</h1>

        <div className="row" style={{ alignItems: "center" }}>
          <span className="badge">⏳ Tiempo: {mm}:{ss}</span>
          <span className="badge">🕵️ Impostores: {iLeft}</span>
          <span className="badge">🙂 Inocentes: {cLeft}</span>
          <button onClick={reset} className="btn">Reiniciar</button>
        </div>

        {toast && <div className="toast">{toast}</div>}

        <div className="panel" style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>
            Eliminar jugador (tap para eliminar)
          </div>

          <div className="stack">
            {gs.players.map((p) => (
              <button
                key={p.name}
                onClick={() => eliminate(p.name)}
                disabled={p.eliminated || gameOver}
                className="btn"
                style={{
                  textAlign: "left",
                  background: p.eliminated ? "#e6e6e6" : undefined,
                }}
              >
                <div style={{ fontWeight: 900 }}>
                  {p.name} {p.eliminated ? "— eliminado" : ""}
                </div>
                {!p.eliminated && !gameOver && (
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    Tap para eliminar
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {gameOver && (
          <div className="panel" style={{ marginTop: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Final final no va más</div>
            <div style={{ marginTop: 8 }}>
              Palabra real: <b>{gs.secretWord}</b>
            </div>
            <div style={{ marginTop: 10, fontWeight: 900 }}>{resultText}</div>

            <div style={{ marginTop: 12, opacity: 0.9 }}>
              Si tienes alguna recomendación, por favor dejamelo saber :D
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
