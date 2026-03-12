import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const NUMBERS = "0123456789";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";

function getStrength(password: string): { label: string; color: string; percent: number } {
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Débil 😰", color: "bg-red-500", percent: 20 };
  if (score <= 4) return { label: "Moderada 😐", color: "bg-yellow-500", percent: 55 };
  return { label: "¡Fuerte! 💪", color: "bg-green-500", percent: 100 };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let charset = "";
    if (useUpper) charset += UPPERCASE;
    if (useLower) charset += LOWERCASE;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;
    if (!charset) { toast.error("Selecciona al menos una opción"); return; }
    let pwd = "";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) pwd += charset[arr[i] % charset.length];
    setPassword(pwd);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success("¡Contraseña copiada! 🔐");
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700 w-28">Longitud: <span className="text-purple-600 font-bold">{length}</span></label>
        <input type="range" min={6} max={64} value={length} onChange={e => setLength(+e.target.value)}
          className="flex-1 accent-purple-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Mayúsculas (A-Z)", val: useUpper, set: setUseUpper },
          { label: "Minúsculas (a-z)", val: useLower, set: setUseLower },
          { label: "Números (0-9)", val: useNumbers, set: setUseNumbers },
          { label: "Símbolos (!@#...)", val: useSymbols, set: setUseSymbols },
        ].map(({ label, val, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 hover:bg-purple-50 transition">
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
              className="accent-purple-600 w-4 h-4" />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
      <button onClick={generate}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform">
        🔑 Generar Contraseña
      </button>
      {password && (
        <div className="space-y-3">
          <div className="bg-gray-950 rounded-2xl p-4 flex items-center gap-3">
            <code className="flex-1 text-green-400 font-mono text-sm break-all">{password}</code>
            <button onClick={copy} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl font-bold transition">
              📋 Copiar
            </button>
          </div>
          {strength && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Fortaleza</span><span>{strength.label}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full transition-all ${strength.color}`} style={{ width: `${strength.percent}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
