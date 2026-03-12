import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function QRGenerator() {
  const [text, setText] = useState("https://google.com");
  const [qrUrl, setQrUrl] = useState("");
  const [size, setSize] = useState(200);

  useEffect(() => {
    if (!text.trim()) { setQrUrl(""); return; }
    const encoded = encodeURIComponent(text.trim());
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=6d28d9&bgcolor=ffffff&qzone=2`);
  }, [text, size]);

  const download = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qr-code.png";
    link.target = "_blank";
    link.click();
    toast.success("¡QR descargado! 📲");
  };

  const copy = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success("URL del QR copiada!");
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        placeholder="Escribe una URL, texto o lo que quieras..."
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
      />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 w-24 shrink-0">Tamaño: <b>{size}px</b></span>
        <input type="range" min={100} max={400} step={50} value={size} onChange={e => setSize(+e.target.value)}
          className="flex-1 accent-violet-600" />
      </div>
      {qrUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
            <img src={qrUrl} alt="QR Code" className="rounded-xl" width={size} height={size} />
          </div>
          <div className="flex gap-2 w-full">
            <button onClick={copy} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition">📋 Copiar URL</button>
            <button onClick={download} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm shadow hover:scale-105 transition-transform">⬇️ Descargar</button>
          </div>
        </div>
      )}
    </div>
  );
}
