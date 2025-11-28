import './App.css'

import CameraView from './components/CameraView';

import MacWindow from "./components/MacWindow";

export default function App() {
  return (
    <div className="bg-neutral-100 flex items-center justify-center rounded-lg">
      <MacWindow title="iWindows">
        <CameraView />
      </MacWindow>
    </div>
  );
}
