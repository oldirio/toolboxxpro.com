import { useState } from "react";
import confetti from "canvas-confetti";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;
const diceTypes: DiceType[] = [4, 6, 8, 10, 12, 20, 100];

export default function DiceRoller() {
  const [diceType, setDiceType] = useState<DiceType>(6);
  const [count, setCount] = useState(2);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = async () => {
    setRolling(true);
    await new Promise(r => setTimeout(r, 600));
    const res = Array.from({ length: count }, () => rollDie(diceType));
    setResults(res);
    setRolling(false);
    const total = res.reduce((a, b) => a + b, 0);
    if (total >= count * diceType * 0.9) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Tipo de dado</p>
          <div className="flex gap-2 flex-wrap">
            {diceTypes.map(d => (
              <button key={d} onClick={() => setDiceType(d)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition ${diceType === d ? "bg-red-500 text-white shadow" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                d{d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 w-28">Cantidad: <b>{count}</b></label>
          <input type="range" min={1} max={10} value={count} onChange={e => setCount(+e.target.value)}
            className="flex-1 accent-red-500" />
        </div>
      </div>
      <button onClick={roll} disabled={rolling}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg shadow hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100">
        {rolling ? "🎲 Lanzando..." : `🎲 Lanzar ${count}d${diceType}`}
      </button>
      {results.length > 0 && !rolling && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {results.map((r, i) => (
              <div key={i}
                className="w-14 h-14 rounded-2xl bg-white border-2 border-red-300 shadow-md flex items-center justify-center text-2xl font-black text-red-600">
                {diceType === 6 ? DICE_FACES[r - 1] : r}
              </div>
            ))}
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-sm">Suma total</p>
            <p className="text-4xl font-black text-red-600">{total}</p>
            <p className="text-xs text-gray-400">Min posible: {count} | Max posible: {count * diceType}</p>
          </div>
        </div>
      )}
    </div>
  );
}
