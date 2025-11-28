import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhotoResult from "./PhotoResult";

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

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
    ctx.drawImage(video, 0, 0);

    const data = canvas.toDataURL("image/png");
    setPhoto(data);
  };

  return (
    <div className="flex flex-col items-center w-full bg-slate-200/20 ">
      {!photo && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-b-lg max-w-full"
            style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9", background: "#000" }}
          />
          <div className="w-full max-w-[900px] flex items-center justify-between mt-2 px-4">
            <button className="flex items-center space-x-2">
              <div className="p-1 bg-white border border-slate-300 rounded-md">
                <ChevronLeft strokeWidth={1.25} strokeOpacity={1}/>
              </div>
              <div className="p-1 bg-white border border-slate-300 rounded-md">
                <ChevronRight strokeWidth={1.25} strokeOpacity={1}/>
              </div>
            </button>
            <button onClick={takePhoto}
              className="my-2 p-3 bg-red-700 ring ring-red-700 border border-t-2 border-red-400 text-white hover:bg-red-900 transition-colors rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="text-sm text-slate-900 border border-slate-300 shadow-xs px-6 py-1 rounded-md bg-white">
              Effects
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      {photo && <PhotoResult photo={photo} onBack={() => setPhoto(null)} />}
    </div>
  );
}
