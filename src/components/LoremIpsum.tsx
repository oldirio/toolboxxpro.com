import { useState } from "react";
import toast from "react-hot-toast";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa officia deserunt mollit anim id est laborum".split(" ");

const SPANISH_WORDS = "el la de que y en un ser se no haber por con su para como al lo si me él una también fue yo sí pero le ya todo así era muy sin sobre poco ella había desde bien hasta donde aquí mientras quien ejemplo forma tiempo otro lugar muchas personas cosas nueva primera segunda tercera cuarta quinta".split(" ");

function generateText(paragraphs: number, lang: "latin" | "spanish"): string {
  const pool = lang === "spanish" ? SPANISH_WORDS : WORDS;
  const result = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentences = Math.floor(Math.random() * 4) + 3;
    const para = [];
    for (let s = 0; s < sentences; s++) {
      const len = Math.floor(Math.random() * 10) + 8;
      const words = Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]);
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      para.push(words.join(" ") + ".");
    }
    result.push(para.join(" "));
  }
  return result.join("\n\n");
}

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [lang, setLang] = useState<"latin" | "spanish">("latin");
  const [text, setText] = useState("");

  const generate = () => setText(generateText(paragraphs, lang));

  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("¡Texto copiado!");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Párrafos: <b>{paragraphs}</b></label>
          <input type="range" min={1} max={10} value={paragraphs} onChange={e => setParagraphs(+e.target.value)}
            className="w-full accent-orange-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Idioma</label>
          <div className="flex gap-1">
            {(["latin", "spanish"] as const).map(l => (
              <button key={l}
                onClick={() => setLang(l)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${lang === l ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {l === "latin" ? "🏛️ Latin" : "🇪🇸 Español"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={generate}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold text-lg shadow hover:scale-105 transition-transform">
        📝 Generar Texto
      </button>
      {text && (
        <div className="space-y-2">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{text}</p>
          </div>
          <button onClick={copy}
            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow transition">
            📋 Copiar todo
          </button>
        </div>
      )}
    </div>
  );
}
