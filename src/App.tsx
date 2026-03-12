import { useState } from "react";
import { Toaster } from "react-hot-toast";
import PasswordGenerator from "./components/PasswordGenerator";
import FakeHacker from "./components/FakeHacker";
import ImageEditor from "./components/ImageEditor";
import QRGenerator from "./components/QRGenerator";
import TextTools from "./components/TextTools";
import ColorPicker from "./components/ColorPicker";
import LoremIpsum from "./components/LoremIpsum";
import CountdownTimer from "./components/CountdownTimer";
import UnitConverter from "./components/UnitConverter";
import MemeText from "./components/MemeText";
import DiceRoller from "./components/DiceRoller";

interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  badge?: string;
  component: React.ReactNode;
}

const tools: Tool[] = [
  {
    id: "password",
    icon: "🔐",
    title: "Generador de Contraseñas",
    description: "Crea contraseñas ultra seguras con un clic",
    color: "from-purple-500 to-indigo-600",
    badge: "🔥 Popular",
    component: <PasswordGenerator />,
  },
  {
    id: "hacker",
    icon: "💻",
    title: "Hacker Falso",
    description: "Simula hackear cualquier sistema (para reír)",
    color: "from-green-600 to-emerald-700",
    badge: "😂 Divertido",
    component: <FakeHacker />,
  },
  {
    id: "image",
    icon: "🖼️",
    title: "Editor de Fotos",
    description: "Ajusta brillo, contraste, filtros y más",
    color: "from-pink-500 to-rose-600",
    badge: "✨ Nuevo",
    component: <ImageEditor />,
  },
  {
    id: "meme",
    icon: "😂",
    title: "Creador de Memes",
    description: "Añade texto a tus imágenes estilo meme",
    color: "from-yellow-400 to-orange-500",
    badge: "LOL",
    component: <MemeText />,
  },
  {
    id: "qr",
    icon: "📲",
    title: "Generador de QR",
    description: "Crea códigos QR de cualquier texto o URL",
    color: "from-violet-500 to-purple-600",
    component: <QRGenerator />,
  },
  {
    id: "text",
    icon: "🔡",
    title: "Herramientas de Texto",
    description: "Transforma texto: mayúsculas, Base64, slugs...",
    color: "from-blue-500 to-cyan-600",
    component: <TextTools />,
  },
  {
    id: "color",
    icon: "🎨",
    title: "Selector de Color",
    description: "HEX, RGB, HSL y paletas de colores",
    color: "from-red-400 to-pink-500",
    component: <ColorPicker />,
  },
  {
    id: "lorem",
    icon: "📝",
    title: "Generador Lorem Ipsum",
    description: "Genera texto de relleno en latín o español",
    color: "from-amber-400 to-orange-500",
    component: <LoremIpsum />,
  },
  {
    id: "timer",
    icon: "⏱️",
    title: "Temporizador",
    description: "Cuenta regresiva con alertas visuales",
    color: "from-cyan-500 to-blue-500",
    component: <CountdownTimer />,
  },
  {
    id: "converter",
    icon: "📐",
    title: "Conversor de Unidades",
    description: "Longitud, peso, temperatura, velocidad, datos",
    color: "from-teal-400 to-green-500",
    component: <UnitConverter />,
  },
  {
    id: "dice",
    icon: "🎲",
    title: "Lanzador de Dados",
    description: "Lanza dados de 4, 6, 8, 10, 12, 20 ó 100 caras",
    color: "from-red-500 to-rose-600",
    component: <DiceRoller />,
  },
];

export function App() {
  const [active, setActive] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = tools.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeTool = tools.find(t => t.id === active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "14px", fontWeight: "600" } }} />

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
              🧰
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none">ToolBox Pro</h1>
              <p className="text-xs text-slate-400 leading-none">Utilidades Web Todo-en-Uno</p>
            </div>
          </div>
          {active && (
            <button
              onClick={() => setActive(null)}
              className="ml-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              ← Volver al menú
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!active ? (
          <>
            {/* Hero */}
            <div className="text-center mb-10 space-y-3">
              <div className="text-6xl animate-bounce">🧰</div>
              <h2 className="text-4xl font-black text-white">Todas tus utilidades en un solo lugar</h2>
              <p className="text-slate-400 text-lg">
                {tools.length} herramientas gratuitas — sin registro, sin límites
              </p>
              <div className="max-w-md mx-auto pt-2">
                <input
                  type="text"
                  placeholder="🔍 Buscar herramienta..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/15 transition"
                />
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-lg font-semibold">No se encontraron herramientas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActive(tool.id)}
                    className="group text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {tool.icon}
                      </div>
                      {tool.badge && (
                        <span className="text-xs font-bold bg-white/15 text-white px-2.5 py-1 rounded-full">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">{tool.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
                    <div className={`mt-4 text-xs font-bold bg-gradient-to-r ${tool.color} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                      Abrir herramienta →
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-16 text-slate-600 text-sm">
              <p>Hecho con ❤️ · ToolBox Pro · Todas las herramientas son 100% gratuitas</p>
            </div>
          </>
        ) : activeTool ? (
          <div className="max-w-2xl mx-auto">
            {/* Tool Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${activeTool.color} flex items-center justify-center text-4xl shadow-xl`}>
                {activeTool.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{activeTool.title}</h2>
                <p className="text-slate-400 text-sm">{activeTool.description}</p>
              </div>
            </div>

            {/* Tool Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/40">
              {activeTool.component}
            </div>

            {/* Other tools suggestion */}
            <div className="mt-8">
              <p className="text-slate-400 text-sm font-semibold mb-3">Otras herramientas:</p>
              <div className="flex gap-2 flex-wrap">
                {tools.filter(t => t.id !== active).slice(0, 5).map(t => (
                  <button key={t.id} onClick={() => setActive(t.id)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-xl transition font-semibold">
                    {t.icon} {t.title}
                  </button>
                ))}
                <button onClick={() => setActive(null)}
                  className="bg-white/5 hover:bg-white/10 text-slate-400 text-sm px-3 py-2 rounded-xl transition font-semibold">
                  Ver todas →
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
