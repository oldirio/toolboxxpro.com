import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining !== null) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            toast.success("⏰ ¡Tiempo terminado!", { duration: 5000 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const start = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total === 0) { toast.error("Pon un tiempo!"); return; }
    setRemaining(total);
    setRunning(true);
  };

  const pause = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setRemaining(null);
  };

  const fmt = (n: number) => {
    const h = Math.floor(n / 3600);
    const m = Math.floor((n % 3600) / 60);
    const s = n % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress = remaining !== null
    ? 1 - remaining / (hours * 3600 + minutes * 60 + seconds || 1)
    : 0;

  return (
    <div className="space-y-5">
      {remaining === null ? (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Horas", val: hours, set: setHours, max: 23 },
            { label: "Minutos", val: minutes, set: setMinutes, max: 59 },
            { label: "Segundos", val: seconds, set: setSeconds, max: 59 },
          ].map(f => (
            <div key={f.label} className="text-center">
              <label className="text-xs text-gray-500 font-semibold">{f.label}</label>
              <input
                type="number"
                min={0}
                max={f.max}
                value={f.val}
                onChange={e => f.set(Math.min(f.max, Math.max(0, +e.target.value)))}
                className="w-full mt-1 text-center text-2xl font-bold border-2 border-gray-200 rounded-2xl py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-3">
          <div className="text-6xl font-mono font-bold text-gray-900 tracking-widest">
            {fmt(remaining)}
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {remaining === 0 && <p className="text-red-500 font-bold text-xl animate-bounce">⏰ ¡TIEMPO!</p>}
        </div>
      )}
      <div className="flex gap-2">
        {remaining === null ? (
          <button onClick={start} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow hover:scale-105 transition-transform">
            ▶️ Iniciar
          </button>
        ) : (
          <>
            <button onClick={running ? pause : () => setRunning(true)}
              className={`flex-1 py-3 rounded-2xl font-bold shadow transition ${running ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900" : "bg-green-400 hover:bg-green-500 text-green-900"}`}>
              {running ? "⏸ Pausar" : "▶️ Reanudar"}
            </button>
            <button onClick={reset} className="flex-1 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold shadow transition">
              🔄 Resetear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
