import { useEffect, useRef, useState } from "react";
import { Download, EllipsisIcon, File, Grid2x2, RefreshCcw, Rows2, Square, Trash } from "lucide-react";

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [photos, setPhotos] = useState([]); // carousel
  const [preview, setPreview] = useState(null); // foto yang diam untuk edit
  const [selectedEffect, setSelectedEffect] = useState("Normal");
  const [layoutMode, setLayoutMode] = useState("single");
  const [overlays, setOverlays] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [drag, setDrag] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [containerW, setContainerW] = useState(900);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [effectsOpen, setEffectsOpen] = useState(false);
  const [fontPickerOpen, setFontPickerOpen] = useState(false);

  const fonts = [
    "Inter",
    "Press Start 2P",
    "Bebas Neue",
    "Lobster",
    "Roboto Mono",
    "Bangers",
    "Indie Flower",
  ];
  const emojiPalette = ["🐛", "🚬", "❤️", "💀", "😂", "😎", "🔥", "✨", "👑", "🐱"];

  const effects = {
    Normal: "none",
    Grayscale: "grayscale(100%)",
    Sepia: "sepia(80%)",
    Invert: "invert(100%)",
    Blur: "blur(4px)",
    Saturate: "saturate(250%)",
    Contrast: "contrast(180%)",
  };
  const effectKeys = Object.keys(effects);

  useEffect(() => {
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 } // Full HD
      });
      videoRef.current.srcObject = stream;
    };
    start();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setContainerW(cr.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = effects[selectedEffect];
    ctx.drawImage(video, 0, 0);

    const data = canvas.toDataURL("image/png");
    setPreview({ src: data, effect: selectedEffect, rotation: 0 });
  };

  const savePreview = async () => {
    if (!preview) return;
    const img = new Image();
    img.src = preview.src;
    await new Promise((res) => { img.onload = res; });
    const canvas = canvasRef.current;
    const r = ((preview.rotation || 0) % 360 + 360) % 360;
    const rotated = r === 90 || r === 270;
    canvas.width = rotated ? img.height : img.width;
    canvas.height = rotated ? img.width : img.height;
    const ctx = canvas.getContext("2d");
    ctx.save();
    if (r === 90) {
      ctx.translate(canvas.width, 0);
      ctx.rotate(Math.PI / 2);
    } else if (r === 180) {
      ctx.translate(canvas.width, canvas.height);
      ctx.rotate(Math.PI);
    } else if (r === 270) {
      ctx.translate(0, canvas.height);
      ctx.rotate(3 * Math.PI / 2);
    }
    ctx.drawImage(img, 0, 0);
    ctx.restore();

    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }
    overlays.forEach((o) => {
      const x = (o.x / 100) * canvas.width;
      const y = (o.y / 100) * canvas.height;
      const size = (o.sizePct / 100) * canvas.width;
      const rad = ((o.rotation || 0) * Math.PI) / 180;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      if (o.type === "emoji") {
        ctx.font = `${size}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(o.content, 0, 0);
      } else {
        ctx.font = `700 ${size}px "${o.font}", sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,.6)";
        ctx.shadowBlur = 4;
        ctx.fillText(o.content, 0, 0);
      }
      ctx.restore();
    });

    const data = canvas.toDataURL("image/png");
    setPhotos((prev) => [data, ...prev].slice(0, 7));
    setPreview(null);
  };

  const deletePreview = () => setPreview(null);

  const rotatePreview = () => {
    if (!preview) return;
    setPreview(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const cycleEffect = () => {
    const idx = effectKeys.indexOf(selectedEffect);
    const next = (idx + 1) % effectKeys.length;
    setSelectedEffect(effectKeys[next]);
  };

  const previewButton = `p-3 bg-white/20 backdrop-blur text-white rounded-full border border-slate-400/40`;

  const addEmoji = (em) => {
    const id = (globalThis.crypto && globalThis.crypto.randomUUID) ? globalThis.crypto.randomUUID() : String(Date.now() + Math.random());
    setOverlays((prev) => [...prev, { id, type: "emoji", content: em, x: 50, y: 50, sizePct: 10, rotation: 0, font: "Segoe UI Emoji" }]);
    setSelectedId(id);
  };

  const addText = () => {
    const txt = textInput.trim();
    if (!txt) return;
    const id = (globalThis.crypto && globalThis.crypto.randomUUID) ? globalThis.crypto.randomUUID() : String(Date.now() + Math.random());
    setOverlays((prev) => [...prev, { id, type: "text", content: txt, x: 50, y: 60, sizePct: 4, rotation: 0, font: selectedFont }]);
    setSelectedId(id);
    setTextInput("");
  };

  const onItemPointerDown = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(item.id);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = (item.x / 100) * rect.width + rect.left;
    const cy = (item.y / 100) * rect.height + rect.top;
    setDrag({ id: item.id, dx: e.clientX - cx, dy: e.clientY - cy, moved: false });
  };

  const onContainerPointerMove = (e) => {
    if (!drag || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let cx = e.clientX - rect.left - drag.dx;
    let cy = e.clientY - rect.top - drag.dy;
    let xp = (cx / rect.width) * 100;
    let yp = (cy / rect.height) * 100;
    xp = Math.max(0, Math.min(100, xp));
    yp = Math.max(0, Math.min(100, yp));
    setOverlays((prev) => prev.map((o) => (o.id === drag.id ? { ...o, x: xp, y: yp } : o)));
    if (!drag.moved) setDrag((d) => (d ? { ...d, moved: true } : d));
  };

  const onContainerPointerUp = () => {
    if (drag && drag.moved) {
      setSelectedId(null);
    }
    setDrag(null);
  };

  const onContainerPointerDown = () => {
    setSelectedId(null);
  };

  const updateSelected = (patch) => {
    if (!selectedId) return;
    setOverlays((prev) => prev.map((o) => (o.id === selectedId ? { ...o, ...patch } : o)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setOverlays((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col items-center w-full bg-white/80 backdrop-blur-2xl transition-colors">

      {/* Carousel 7 foto terakhir */}
      {photos.length > 0 && (
        <div className="flex w-full max-w-[900px] overflow-x-auto space-x-2 p-2 mb-4 hover:scale-115">
          {photos.map((p, i) => (
            <img key={i} src={p} alt={`Preview ${i}`} className="h-24 rounded-md object-cover shrink-0" />
          ))}
        </div>
      )}

      {/* Preview edit / baru */}
      {preview ? (
        <div className="relative w-full max-w-[900px]">
          <div
            ref={containerRef}
            className="relative w-full mb-3"
            style={{ aspectRatio: "16/9", touchAction: "none" }}
            onPointerMove={onContainerPointerMove}
            onPointerUp={onContainerPointerUp}
            onPointerLeave={onContainerPointerUp}
            onPointerDown={onContainerPointerDown}
          >
            <img
              src={preview.src}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-md"
              style={{
                transform: `rotate(${preview.rotation}deg)`,
                filter: effects[preview.effect],
              }}
            />

            {overlays.map((o) => (
              <span
                key={o.id}
                onPointerDown={(e) => onItemPointerDown(e, o)}
                className={`absolute select-none cursor-move ${selectedId === o.id ? "ring-2 ring-sky-400 rounded" : ""}`}
                style={{
                  left: `${o.x}%`,
                  top: `${o.y}%`,
                  transform: `translate(-50%, -50%) rotate(${o.rotation || 0}deg)`,
                  fontSize: `${(o.sizePct / 100) * containerW}px`,
                  fontFamily: o.type === "text" ? `"${o.font}", sans-serif` : undefined,
                  color: o.type === "text" ? "#ffffff" : undefined,
                  textShadow: o.type === "text" ? "0 1px 2px rgba(0,0,0,.6)" : undefined,
                  userSelect: "none",
                }}
              >
                {o.content}
              </span>
            ))}
          </div>

          {/* Controls kiri/kanan */}
          <div className="absolute top-4 left-5 flex gap-2">
            <button className={`${previewButton} hover:text-sky-400`}>
              <EllipsisIcon size={14} />
            </button>
            <button className={`${previewButton} hover:text-sky-400`} onClick={rotatePreview}>
              <RefreshCcw size={14} />
            </button>
          </div>
          <div className="absolute top-4 right-5 flex gap-2">
            <button className={`${previewButton} hover:text-green-400`} onClick={savePreview}>
              <Download size={14} />
            </button>
            <button className={`${previewButton} hover:text-red-400`} onClick={deletePreview}>
              <Trash size={14} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="relative w-full max-w-[900px] mb-3"
            style={{ aspectRatio: "16/9", touchAction: "none" }}
            onPointerMove={onContainerPointerMove}
            onPointerUp={onContainerPointerUp}
            onPointerLeave={onContainerPointerUp}
            onPointerDown={onContainerPointerDown}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-md -scale-x-100"
              style={{
                filter: effects[selectedEffect],
                background: "#000",
              }}
            />

            {overlays.map((o) => (
              <span
                key={o.id}
                onPointerDown={(e) => onItemPointerDown(e, o)}
                className={`absolute select-none cursor-move ${selectedId === o.id ? "ring-2 ring-sky-400 rounded" : ""}`}
                style={{
                  left: `${o.x}%`,
                  top: `${o.y}%`,
                  transform: `translate(-50%, -50%) rotate(${o.rotation || 0}deg)`,
                  fontSize: `${(o.sizePct / 100) * containerW}px`,
                  fontFamily: o.type === "text" ? `"${o.font}", sans-serif` : undefined,
                  color: o.type === "text" ? "#ffffff" : undefined,
                  textShadow: o.type === "text" ? "0 1px 2px rgba(0,0,0,.6)" : undefined,
                  userSelect: "none",
                }}
              >
                {o.content}
              </span>
            ))}
          </div>

          <div className="w-full max-w-[900px] flex items-center justify-between px-6 mt-3">
            <div className="flex items-center">
              <div className="inline-flex border border-slate-300 shadow-sm rounded-md bg-white overflow-hidden">
                <button onClick={() => setLayoutMode("single")}
                  className={`group px-3 py-1 text-sm border-r border-slate-300 flex items-center justify-center ${layoutMode === "single" ? "bg-linear-to-t from-blue-600 to-blue-400 text-white" : "bg-white text-gray-700"}`}
                >
                  <Grid2x2 strokeWidth={1.5} size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button onClick={() => setLayoutMode("col4")}
                  className={`group px-3 py-1 text-sm border-r border-slate-300 flex items-center justify-center ${layoutMode === "col4" ? "bg-linear-to-t from-blue-600 to-blue-400 text-white" : "bg-white text-gray-700"}`}
                >
                  <Square strokeWidth={1.5} size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button onClick={() => setLayoutMode("col2")}
                  className={`group px-3 py-1 text-sm flex items-center justify-center ${layoutMode === "col2" ? "bg-linear-to-t from-blue-600 to-blue-400 text-white" : "bg-white text-gray-700"}`}
                >
                  <Rows2 strokeWidth={1.5} size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <button onClick={takePhoto}
              className="my-2.5 p-4 bg-red-700 ring ring-red-700 border border-t-2 border-red-400 hover:border-red-500 text-white hover:bg-red-900 transition-colors rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </>
      )}

      <div className="w-full max-w-[900px] px-6 py-2 flex flex-wrap items-center gap-2">
        <button onClick={() => { setEmojiPickerOpen(true); setEffectsOpen(false); setFontPickerOpen(false); }} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50">Emoji</button>
        <button onClick={() => { setEffectsOpen(true); setEmojiPickerOpen(false); setFontPickerOpen(false); }} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50">Efek</button>
        <button
          onClick={() => { setFontPickerOpen(true); setEmojiPickerOpen(false); setEffectsOpen(false); }}
          className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50"
          style={{ fontFamily: `"${selectedFont}", sans-serif` }}
        >
          Font: {selectedFont}
        </button>

        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Tulis nama..."
          className="px-2 py-1 border border-slate-300 rounded bg-white text-sm"
          style={{ fontFamily: `"${selectedFont}", sans-serif` }}
        />
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="px-2 py-1 border border-slate-300 rounded bg-white text-sm"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <button onClick={addText} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50">Tambah teks</button>

        <div className="ml-auto flex items-center gap-2">
          {(() => {
            const sel = overlays.find((o) => o.id === selectedId);
            if (!sel) return null;
            return (
              <>
                <label className="text-xs text-slate-600">Ukuran</label>
                <input
                  type="range"
                  min={2}
                  max={25}
                  value={sel.sizePct}
                  onChange={(e) => updateSelected({ sizePct: Number(e.target.value) })}
                />
                <label className="text-xs text-slate-600">Rotasi</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={sel.rotation || 0}
                  onChange={(e) => updateSelected({ rotation: Number(e.target.value) })}
                />
                {sel.type === "text" && (
                  <>
                    <input
                      value={sel.content}
                      onChange={(e) => updateSelected({ content: e.target.value })}
                      placeholder="Edit nama..."
                      className="px-2 py-1 border border-slate-300 rounded bg-white text-sm"
                      style={{ fontFamily: `"${sel.font}", sans-serif` }}
                    />
                    <button
                      onClick={() => { setFontPickerOpen(true); setEmojiPickerOpen(false); setEffectsOpen(false); }}
                      className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50"
                      style={{ fontFamily: `"${sel.font}", sans-serif` }}
                    >
                      Font: {sel.font}
                    </button>
                  </>
                )}
                <button onClick={deleteSelected} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-red-50 text-red-600">Hapus</button>
              </>
            );
          })()}
        </div>
      </div>

      {emojiPickerOpen && (
        <div className="fixed top-4 right-4 bottom-4 z-50 w-[min(360px,90vw)] rounded-xl shadow-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-semibold">Emoji</div>
            <button onClick={() => setEmojiPickerOpen(false)} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50">Tutup</button>
          </div>
          <div className="grid grid-cols-6 gap-2 overflow-auto pr-1 h-full">
            {emojiPalette.map((em) => (
              <button
                key={em}
                onClick={() => { addEmoji(em); setEmojiPickerOpen(false); }}
                className="aspect-square text-2xl flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50"
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      )}

      {effectsOpen && (
        <div className="fixed top-4 right-4 bottom-4 z-50 w-[min(360px,90vw)] rounded-xl shadow-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-semibold">Efek</div>
            <button onClick={() => setEffectsOpen(false)} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50">Tutup</button>
          </div>
          <div className="grid grid-cols-2 gap-2 overflow-auto pr-1 h-full">
            {effectKeys.map((k) => (
              <button
                key={k}
                onClick={() => { setSelectedEffect(k); setEffectsOpen(false); }}
                className={`h-16 border rounded flex items-center justify-center text-sm ${selectedEffect === k ? "border-sky-400 ring-1 ring-sky-300" : "border-slate-200"}`}
                style={{ filter: effects[k] }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {fontPickerOpen && (
        <div className="fixed top-4 right-4 bottom-4 z-50 w-[min(360px,90vw)] rounded-xl shadow-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-semibold">Font</div>
            <button onClick={() => setFontPickerOpen(false)} className="px-3 py-1 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50">Tutup</button>
          </div>
          <div className="flex flex-col gap-2 overflow-auto pr-1 h-full">
            {fonts.map((f) => (
              <button
                key={f}
                onClick={() => {
                  const sel = overlays.find((o) => o.id === selectedId);
                  if (sel && sel.type === "text") {
                    updateSelected({ font: f });
                  } else {
                    setSelectedFont(f);
                  }
                  setFontPickerOpen(false);
                }}
                className="h-12 border rounded px-3 text-left hover:bg-slate-50"
                style={{ fontFamily: `"${f}", sans-serif` }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
