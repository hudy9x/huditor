import { useState } from "react";
import { appWindow } from "@tauri-apps/api/window";

export default function Titlebar() {
  const [isScaleup, setScaleup] = useState(false);
  const onMinimize = () => appWindow.minimize();
  const onScaleup = () => {
    appWindow.toggleMaximize();
    setScaleup(true);
  }

  const onScaledown = () => {
    appWindow.toggleMaximize();
    setScaleup(false);
  }

  const onClose = () => appWindow.close();

  return <div id="titlebar" data-tauri-drag-region>
    <div className="flex items-center gap-1 5 pl-2">
      <img src="/tauri.svg" style={{ width: 10 }} alt="" />
      <span className="text-xs uppercase">huditor</span>
    </div>

    <div className="titlebar-actions">
      <i className="titlebar-icon ri-subtract-line" onClick={onMinimize}></i>

      {isScaleup ? <i className="titlebar-icon ri-file-copy-line" onClick={onScaledown}></i> : <i onClick={onScaleup} className="titlebar-icon ri-stop-line"></i>}

      <i id="ttb-close" className="titlebar-icon ri-close-fill" onClick={onClose}></i>
    </div>
  </div>
}
