import { useState, useRef } from "react";
import toast from "react-hot-toast";

const fonts = ["Impact", "Arial Black", "Comic Sans MS", "Courier New", "Georgia"];
const colors = ["#ffffff", "#ffff00", "#ff4444", "#44ff44", "#44aaff", "#ff44ff", "#ff8800", "#000000"];

export default function MemeText() {
  const [img, setImg] = useState<string | null>(null);
  const [topText, setTopText] = useState("CUANDO FINALMENTE");
  const [bottomText, setBottomText] = useState("LO LOGRAS");
  const [font, setFont] = useState("Impact");
  const [color, setColor] = useState("#ffffff");
  const [strokeColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(48);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImg(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const drawMeme = () => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = color;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = fontSize / 10;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 16);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 16);
      }
      ctx.textBaseline = "bottom";
      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 16);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 16);
      }
    };
    image.src = img;
  };

  const download = () => {
    if (!canvasRef.current) return;
    drawMeme();
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvasRef.current!.toDataURL();
      link.click();
      toast.success("¡Meme descargado! 😂");
    }, 300);
  };

  return (
    <div className="space-y-4">
      {!img ? (
        <div onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-yellow-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-yellow-50 transition">
          <div className="text-4xl mb-2">😂</div>
          <p className="text-gray-600 font-semibold">Sube una imagen para crear un meme</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <canvas ref={canvasRef} className="hidden" />
            <div className="relative">
              <img src={img} alt="meme" className="w-full rounded-2xl" />
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                <p className="text-center font-black text-shadow-meme break-words"
                  style={{ fontFamily: font, fontSize: `${Math.max(16, fontSize * 0.4)}px`, color, WebkitTextStroke: `2px ${strokeColor}`, textShadow: `2px 2px 0 ${strokeColor}` }}>
                  {topText.toUpperCase()}
                </p>
                <p className="text-center font-black break-words"
                  style={{ fontFamily: font, fontSize: `${Math.max(16, fontSize * 0.4)}px`, color, WebkitTextStroke: `2px ${strokeColor}`, textShadow: `2px 2px 0 ${strokeColor}` }}>
                  {bottomText.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          <input value={topText} onChange={e => setTopText(e.target.value)} placeholder="Texto arriba..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Texto abajo..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Fuente</label>
              <select value={font} onChange={e => setFont(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-2 py-1.5 text-sm focus:outline-none">
                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Tamaño: {fontSize}px</label>
              <input type="range" min={20} max={100} value={fontSize} onChange={e => setFontSize(+e.target.value)}
                className="w-full accent-yellow-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Color texto</p>
              <div className="flex gap-1">
                {colors.map(c => (
                  <div key={c} onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${color === c ? "border-purple-500 scale-125" : "border-gray-300"} transition-transform`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setImg(null); if (fileRef.current) fileRef.current.value = ""; }}
              className="flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm">🗑️ Cambiar</button>
            <button onClick={download}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm shadow hover:scale-105 transition-transform">⬇️ Descargar Meme</button>
          </div>
        </div>
      )}
    </div>
  );
}
