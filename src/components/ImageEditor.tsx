import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";

interface Filters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
}

const defaultFilters: Filters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
};

const controls = [
  { key: "brightness", label: "☀️ Brillo", min: 0, max: 200, unit: "%" },
  { key: "contrast", label: "🌗 Contraste", min: 0, max: 200, unit: "%" },
  { key: "saturation", label: "🎨 Saturación", min: 0, max: 200, unit: "%" },
  { key: "blur", label: "💧 Desenfoque", min: 0, max: 10, unit: "px" },
  { key: "grayscale", label: "⬛ Escala grises", min: 0, max: 100, unit: "%" },
  { key: "sepia", label: "🟤 Sepia", min: 0, max: 100, unit: "%" },
  { key: "hueRotate", label: "🌈 Tono", min: 0, max: 360, unit: "°" },
  { key: "invert", label: "🔄 Invertir", min: 0, max: 100, unit: "%" },
];

function buildFilter(f: Filters) {
  return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg) invert(${f.invert}%)`;
}

export default function ImageEditor() {
  const [img, setImg] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = ev => setImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const reset = () => setFilters(defaultFilters);

  const download = () => {
    if (!img || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const image = imgRef.current;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = buildFilter(filters);
    ctx.drawImage(image, 0, 0);
    const link = document.createElement("a");
    link.download = "imagen-editada.png";
    link.href = canvas.toDataURL();
    link.click();
    toast.success("¡Imagen descargada! 📸");
  };

  return (
    <div className="space-y-4">
      {!img ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-pink-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-pink-50 transition"
        >
          <div className="text-5xl mb-2">🖼️</div>
          <p className="text-gray-600 font-semibold">Arrastra una imagen aquí o haz clic</p>
          <p className="text-gray-400 text-sm">PNG, JPG, WEBP, GIF</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center max-h-60">
            <img
              ref={imgRef}
              src={img}
              alt="preview"
              className="max-h-60 object-contain transition-all duration-300"
              style={{ filter: buildFilter(filters) }}
              crossOrigin="anonymous"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {controls.map(c => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-36 shrink-0">{c.label}</span>
                <input
                  type="range"
                  min={c.min}
                  max={c.max}
                  value={filters[c.key as keyof Filters]}
                  onChange={e => setFilters(f => ({ ...f, [c.key]: +e.target.value }))}
                  className="flex-1 accent-pink-500"
                />
                <span className="text-xs text-gray-500 w-14 text-right">
                  {filters[c.key as keyof Filters]}{c.unit}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition">🔄 Resetear</button>
            <button onClick={() => { setImg(null); fileRef.current && (fileRef.current.value = ""); }} className="flex-1 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm transition">🗑️ Cambiar foto</button>
            <button onClick={download} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow transition hover:scale-105">⬇️ Descargar</button>
          </div>
        </div>
      )}
    </div>
  );
}
