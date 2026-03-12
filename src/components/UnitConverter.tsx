import { useState } from "react";

type Category = "length" | "weight" | "temp" | "speed" | "data";

const categories: { key: Category; label: string; icon: string }[] = [
  { key: "length", label: "Longitud", icon: "📏" },
  { key: "weight", label: "Peso", icon: "⚖️" },
  { key: "temp", label: "Temperatura", icon: "🌡️" },
  { key: "speed", label: "Velocidad", icon: "🚀" },
  { key: "data", label: "Datos", icon: "💾" },
];

type Units = Record<Category, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]>;

const units: Units = {
  length: [
    { label: "Metros (m)", toBase: v => v, fromBase: v => v },
    { label: "Kilómetros (km)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: "Centímetros (cm)", toBase: v => v / 100, fromBase: v => v * 100 },
    { label: "Pulgadas (in)", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: "Pies (ft)", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: "Millas (mi)", toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    { label: "Yardas (yd)", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  ],
  weight: [
    { label: "Kilogramos (kg)", toBase: v => v, fromBase: v => v },
    { label: "Gramos (g)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: "Libras (lb)", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: "Onzas (oz)", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { label: "Toneladas (t)", toBase: v => v * 1000, fromBase: v => v / 1000 },
  ],
  temp: [
    { label: "Celsius (°C)", toBase: v => v, fromBase: v => v },
    { label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { label: "Kelvin (K)", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  speed: [
    { label: "m/s", toBase: v => v, fromBase: v => v },
    { label: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { label: "mph", toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { label: "nudos", toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  ],
  data: [
    { label: "Bytes (B)", toBase: v => v, fromBase: v => v },
    { label: "Kilobytes (KB)", toBase: v => v * 1024, fromBase: v => v / 1024 },
    { label: "Megabytes (MB)", toBase: v => v * 1024 ** 2, fromBase: v => v / 1024 ** 2 },
    { label: "Gigabytes (GB)", toBase: v => v * 1024 ** 3, fromBase: v => v / 1024 ** 3 },
    { label: "Terabytes (TB)", toBase: v => v * 1024 ** 4, fromBase: v => v / 1024 ** 4 },
  ],
};

function fmt(n: number) {
  if (isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toString();
}

export default function UnitConverter() {
  const [cat, setCat] = useState<Category>("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");

  const u = units[cat];
  const input = parseFloat(value);
  const result = isNaN(input) ? NaN : u[toIdx].fromBase(u[fromIdx].toBase(input));

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => { setCat(c.key); setFromIdx(0); setToIdx(1); }}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${cat === c.key ? "bg-teal-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select value={fromIdx} onChange={e => setFromIdx(+e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
            {u.map((un, i) => <option key={i} value={i}>{un.label}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-center text-2xl">⬇️</div>
        <div className="flex gap-2">
          <div className="flex-1 border-2 border-teal-400 rounded-xl px-3 py-2 text-lg font-bold bg-teal-50 text-teal-800">
            {fmt(result)}
          </div>
          <select value={toIdx} onChange={e => setToIdx(+e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
            {u.map((un, i) => <option key={i} value={i}>{un.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
