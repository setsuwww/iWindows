import './App.css'

import { useState } from "react";

import CameraView from './components/CameraView';
import MacWindow from "./components/MacWindow";

export default function App() {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  if (!open) return null;
  return (
    <div className="bg-neutral-100 flex items-center justify-center rounded-lg">
      <MacWindow title="Photobooth"
        onClose={() => setOpen(false)}
        onMinimize={() => setMinimized(v => !v)}
        onMaximize={() => setMaximized(v => !v)}
      >
        
        <div className={ maximized ? "w-full h-[90vh]" : minimized ? "h-0 overflow-hidden" : "-p-0"}>
          <CameraView />
        </div>
      </MacWindow>
    </div>
  );
}
