export default function MacWindow({ title = "", children, onClose, onMinimize, onMaximize }) {
  return (
    <div className="w-[1000px] rounded-xl overflow-hidden bg-[#f8f8f8] border border-[#d0d0d0] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
      <div className=" h-8 flex items-center relative px-4 border-b border-[#d8d8d8] bg-linear-to-b from-[#e9e9e9] to-[#dcdcdc] backdrop-blur-sm
        "
        style={{
          WebkitAppRegion: "drag"
        }}
      >
        <div className="flex items-center gap-[7px]">
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:bg-red-600 hover:border-red-700 transition-colors"
            style={{ WebkitAppRegion: "no-drag" }}
          ></button>

          <button
            onClick={onMinimize}
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:bg-yellow-600 hover:border-yellow-700 transition-colors"
            style={{ WebkitAppRegion: "no-drag" }}
          ></button>

          <button
            onClick={onMaximize}
            className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1dad36] hover:bg-green-600 hover:border-green-700 transition-colors"
            style={{ WebkitAppRegion: "no-drag" }}
          ></button>
        </div>


        <div className="
          absolute left-1/2 -translate-x-1/2
          text-[13px] text-[#5e5e5e]
          font-medium
          tracking-wide
          select-none
        ">
          {title}
        </div>
      </div>

      <div className="bg-slate-500/10 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
