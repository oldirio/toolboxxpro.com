import { useState } from "react";
import toast from "react-hot-toast";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generatePalette(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex);
  const palette: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const f = i / 5;
    const nr = Math.round(r + (255 - r) * (1 - f));
    const ng = Math.round(g + (255 - g) * (1 - f));
    const nb = Math.round(b + (255 - b) * (1 - f));
    palette.push(`#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`);
  }
  return palette.reverse();
}

export default function ColorPicker() {
  const [color, setColor] = useState("#6d28d9");

  const { r, g, b } = hexToRgb(color);
  const { h, s, l } = hexToHsl(color);
  const palette = generatePalette(color);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copiado: ${text}`);
  };

  const formats = [
    { label: "HEX", value: color },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: "CSS var", value: `--color-primary: ${color};` },
    { label: "Tailwind", value: `[${color}]` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-white shadow-lg" />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={color}
            onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value); }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="mt-1 h-4 rounded-full shadow-inner" style={{ background: color }} />
        </div>
      </div>
      <div className="space-y-2">
        {formats.map(f => (
          <div key={f.label}
            onClick={() => copy(f.value)}
            className="flex items-center gap-3 bg-gray-50 hover:bg-purple-50 border border-gray-100 rounded-xl px-3 py-2 cursor-pointer transition group">
            <span className="text-xs font-bold text-gray-400 w-16">{f.label}</span>
            <code className="flex-1 text-xs text-gray-800 font-mono truncate">{f.value}</code>
            <span className="text-xs text-purple-400 group-hover:text-purple-600 transition">📋</span>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Paleta generada</p>
        <div className="flex gap-1 h-10">
          {palette.map(c => (
            <div
              key={c}
              onClick={() => copy(c)}
              className="flex-1 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-sm"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
