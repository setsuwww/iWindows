import './App.css'

import CameraView from './components/CameraView';
import MacWindow from "./components/MacWindow";

export default function App() {
  if (!open) return null;
  return (
    <div className="w-fit h-fit">
      <MacWindow title='Photo Booth'>
        <CameraView />
      </MacWindow>
    </div>
  );
}
