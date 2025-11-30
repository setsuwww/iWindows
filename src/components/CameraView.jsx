import { useEffect, useRef, useState } from "react";
import PhotoResult from "./PhotoResult";
import { Grid2x2, Rows2, Square } from "lucide-react";

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

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
  const [selectedEffect, setSelectedEffect] = useState("Effects");

  // layout mode
  const [layoutMode, setLayoutMode] = useState("single");

  useEffect(() => {
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
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

    const link = document.createElement("a");
    link.href = data;
    link.download = `photo-${selectedEffect}-${Date.now()}.png`;
    link.click();

    setPhoto(data);
  };

  const cycleEffect = () => {
    const idx = effectKeys.indexOf(selectedEffect);
    const next = (idx + 1) % effectKeys.length;
    setSelectedEffect(effectKeys[next]);
  };

  return (
    <div className="flex flex-col items-center w-full bg-white/80 backdrop-blur-2xl">

      {!photo && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-b-sm max-w-full -scale-x-100"
            style={{
              width: "100%",
              maxWidth: "100%",
              aspectRatio: "16/9",
              background: "#000",
              filter: effects[selectedEffect]
            }}
          />

          <div className="w-full max-w-[900px] flex items-center justify-between px-6">
            <div className="flex items-center">
              <div className="inline-flex border border-slate-300 shadow-sm rounded-md bg-white overflow-hidden">
                <button onClick={() => setLayoutMode("single")}
                  className={`group px-3 py-1 text-sm border-r border-slate-300 flex items-center justify-center ${layoutMode === "single" ? "bg-linear-to-t from-blue-600 to-blue-400 text-white" : "bg-white text-gray-700"
                    }`}
                >
                  <Grid2x2 strokeWidth={1.5 } size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                <button onClick={() => setLayoutMode("col4")}
                  className={`group px-3 py-1 text-sm border-r border-slate-300 flex items-center justify-center ${layoutMode === "col4" ? "bg-linear-to-t from-blue-600 to-blue-400 text-white" : "bg-white text-gray-700"}`}
                >
                  <Square strokeWidth={1.5  } size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                <button onClick={() => setLayoutMode("col2")}
                  className={`group px-3 py-1 text-sm flex items-center justify-center ${layoutMode === "col2" ? "bg-linear-to-t from-blue-600 to-blue-400 text-white" : "bg-white text-gray-700"}`}
                >
                  <Rows2 strokeWidth={1.5 } size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <button onClick={takePhoto}
              className="my-2.5 p-4 bg-red-700 ring ring-red-700 border border-t-2 border-red-400 hover:border-red-5  00 text-white hover:bg-red-900 transition-colors rounded-full"
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

      {photo && (<PhotoResult photo={photo} onBack={() => setPhoto(null)}/>)}
    </div>
  );
}
