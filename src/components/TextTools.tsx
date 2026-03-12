import { useState } from "react";
import toast from "react-hot-toast";

const actions = [
  { label: "MAYÚSCULAS", fn: (s: string) => s.toUpperCase(), icon: "⬆️" },
  { label: "minúsculas", fn: (s: string) => s.toLowerCase(), icon: "⬇️" },
  { label: "Capitalizar", fn: (s: string) => s.replace(/\b\w/g, c => c.toUpperCase()), icon: "🔡" },
  { label: "Invertir", fn: (s: string) => s.split("").reverse().join(""), icon: "🔄" },
  { label: "Eliminar espacios", fn: (s: string) => s.replace(/\s+/g, " ").trim(), icon: "✂️" },
  { label: "Contar palabras", fn: (s: string) => `Palabras: ${s.trim().split(/\s+/).filter(Boolean).length} | Chars: ${s.length}`, icon: "📊" },
  { label: "🔐 Base64 (encode)", fn: (s: string) => btoa(unescape(encodeURIComponent(s))), icon: "🔐" },
  { label: "🔓 Base64 (decode)", fn: (s: string) => { try { return decodeURIComponent(escape(atob(s))); } catch { return "❌ No es Base64 válido"; } }, icon: "🔓" },
  { label: "Alternar CaSo", fn: (s: string) => s.split("").map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(""), icon: "〰️" },
  { label: "Slug URL", fn: (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim(), icon: "🔗" },
];

export default function TextTools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const apply = (fn: (s: string) => string) => {
    setOutput(fn(input));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("¡Copiado al portapapeles!");
  };

  const swap = () => {
    setInput(output);
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={4}
        placeholder="Escribe o pega texto aquí..."
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
      <div className="grid grid-cols-2 gap-2">
        {actions.map(a => (
          <button
            key={a.label}
            onClick={() => apply(a.fn)}
            className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold transition text-left"
          >
            {a.icon} {a.label}
          </button>
        ))}
      </div>
      {output && (
        <div className="space-y-2">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
            <p className="text-sm text-gray-800 break-all whitespace-pre-wrap">{output}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={swap} className="flex-1 py-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold text-xs transition">🔁 Usar como entrada</button>
            <button onClick={copy} className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition">📋 Copiar resultado</button>
          </div>
        </div>
      )}
    </div>
  );
}
