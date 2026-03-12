import { useState, useEffect, useRef } from "react";

const LINES = [
  "Iniciando kernel bypass v4.2.0...",
  "Conectando a servidor proxy anónimo [TOR]...",
  "Saltando firewall... SUCCESS",
  "Acceso al mainframe: GRANTED ✓",
  "Desencriptando protocolo SSH...",
  "Inyectando payload en el sistema...",
  "Bypassing 2FA authentication...",
  "Root access: OBTAINED ✓",
  "Descargando base de datos... [████████] 100%",
  "Borrando logs del sistema...",
  "Instalando backdoor persistente...",
  "Tunel VPN establecido: 192.168.0.1 → 10.0.0.1",
  "Extrayendo credenciales de memoria...",
  "Hash cracking: MD5 → SHA256 bypass...",
  "Acceso total al sistema: CONFIRMADO ✓",
  "Iniciando fase 2: deep scan...",
  "Detectando vulnerabilidad CVE-2024-9999...",
  "Explotando buffer overflow...",
  "Escalada de privilegios: ROOT ✓",
  "Sistema comprometido. Mision completada. 🔥",
];

function randomLine() {
  const extras = [
    `[${Math.random().toString(16).slice(2, 10).toUpperCase()}] Acceso denegado... reintentando...`,
    `Ping: ${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}ms TTL=64`,
    `IP redirigida: ${Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".")}`,
    `ENCRYPTED: ${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
    `>>> exec("rm -rf /tmp/.cache && inject")`,
  ];
  return extras[Math.floor(Math.random() * extras.length)];
}

export default function FakeHacker() {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdx = useRef(0);

  const start = () => {
    setLines([]);
    setDone(false);
    setRunning(true);
    lineIdx.current = 0;
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setLines(prev => {
        const next = [...prev];
        if (Math.random() > 0.6 && lineIdx.current < LINES.length) {
          next.push("$ " + LINES[lineIdx.current]);
          lineIdx.current++;
        } else {
          next.push("  " + randomLine());
        }
        if (lineIdx.current >= LINES.length) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setDone(true);
        }
        return next.slice(-60);
      });
    }, 180);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="space-y-4">
      <div
        ref={terminalRef}
        className="bg-black rounded-2xl p-4 h-72 overflow-y-auto font-mono text-xs space-y-0.5 border border-green-900 shadow-lg shadow-green-900/20"
      >
        {lines.length === 0 && (
          <p className="text-green-700">Presiona "INICIAR HACK" para comenzar...</p>
        )}
        {lines.map((l, i) => (
          <div key={i} className={`leading-5 ${l.startsWith("$") ? "text-green-400 font-bold" : "text-green-600"}`}>
            {l}
          </div>
        ))}
        {running && <span className="text-green-400 animate-pulse">█</span>}
        {done && (
          <div className="mt-2 text-red-400 font-bold text-sm animate-pulse">
            ⚠️ SISTEMA HACKEADO EXITOSAMENTE ⚠️
          </div>
        )}
      </div>
      <button
        onClick={start}
        disabled={running}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-black font-bold text-lg shadow hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100"
      >
        {running ? "💻 Hackeando..." : done ? "🔄 Hackear de nuevo" : "💀 INICIAR HACK"}
      </button>
      <p className="text-center text-xs text-gray-400">⚠️ Esto es solo para diversión. No hackees a nadie de verdad.</p>
    </div>
  );
}
