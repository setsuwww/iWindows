import { useEffect, useRef, useState } from "react";
import { Download, EllipsisIcon, File, Grid2x2, RefreshCcw, Rows2, Square, Trash } from "lucide-react";

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]); // carousel
  const [preview, setPreview] = useState(null); // foto yang diam untuk edit
  const [selectedEffect, setSelectedEffect] = useState("Normal");
  const [layoutMode, setLayoutMode] = useState("single");
  const [rotation, setRotation] = useState(0);

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

  const savePreview = () => {
    if (!preview) return;
    setPhotos(prev => [preview.src, ...prev].slice(0, 7));
    setPreview(null);
  };

  const deletePreview = () => setPreview(null);

  const rotatePreview = () => {
    if (!preview) return;
    setPreview(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const applyEffectPreview = (effect) => {
    if (!preview) return;
    setPreview(prev => ({ ...prev, effect }));
  };

  const cycleEffect = () => {
    const idx = effectKeys.indexOf(selectedEffect);
    const next = (idx + 1) % effectKeys.length;
    setSelectedEffect(effectKeys[next]);
  };

  const previewButton = `p-3 bg-white/20 backdrop-blur text-white rounded-full border border-slate-400/40`;

  return (
    <div className="flex flex-col items-center w-full bg-white/80 backdrop-blur-2xl transition-colors">

      {/* Carousel 7 foto terakhir */}
      {photos.length > 0 && (
        <div className="flex w-full max-w-[900px] overflow-x-auto space-x-2 p-2 mb-4 hover:scale-115">
          {photos.map((p, i) => (
            <img key={i} src={p} alt={`Preview ${i}`} className="h-24 rounded-md object-cover flex-shrink-0" />
          ))}
        </div>
      )}

      {/* Preview edit / baru */}
      {preview ? (
        <div className="relative w-full max-w-[900px]">
          <img
            src={preview.src}
            alt="Preview"
            style={{
              transform: `rotate(${preview.rotation}deg)`,
              filter: effects[preview.effect],
              width: "100%",
              aspectRatio: "16/9",
            }}
            className="rounded-md"
          />

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
          {/* Video & controls */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-b-sm max-w-full -scale-x-100 mb-3"
            style={{
              width: "100%",
              maxWidth: "900px",
              aspectRatio: "16/9",
              background: "#000",
              filter: effects[selectedEffect]
            }}
          />

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

            <button onClick={cycleEffect} className="text-sm text-slate-700 border border-slate-300 shadow-sm px-8 py-1 rounded-md bg-white hover:bg-slate-100 hover:border-slate-400">
              {selectedEffect}
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
