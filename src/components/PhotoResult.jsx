import { useState } from "react";
import LoveSticker from "./LoveSticker";

export default function PhotoResult({ photo, onBack }) {
  const [loves, setLoves] = useState([]);

  const addLove = () => {
    setLoves([...loves, { id: Date.now(), x: 100, y: 100 }]);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative border border-neutral-300 shadow-md rounded-lg overflow-hidden"
        style={{ width: "700px", height: "393px" }}  
      >
        <img
          src={photo}
          className="w-full h-full object-cover"
          alt="Captured"
        />

        {loves.map((l) => (
          <LoveSticker key={l.id} x={l.x} y={l.y} />
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300"
        >
          Kembali
        </button>
        <button
          onClick={addLove}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
        >
          Tambah Lope
        </button>
      </div>
    </div>
  );
}
