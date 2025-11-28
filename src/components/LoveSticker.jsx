import { useRef, useState } from "react";

export default function LoveSticker({ x, y }) {
  const itemRef = useRef(null);
  const [pos, setPos] = useState({ x, y });
  const [drag, setDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    setDrag(true);
    const rect = itemRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onDrag = (e) => {
    if (!drag) return;
    setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const stopDrag = () => setDrag(false);

  return (
    <div
      ref={itemRef}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        cursor: "grab",
        fontSize: "40px",
        userSelect: "none"
      }}
    >
      ♥
    </div>
  );
}
