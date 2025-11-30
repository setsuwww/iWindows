export default function MacWindow({ title = "", children }) {
  return (
    <div className="min-w-[200px] max-w-[900px] w-full rounded-xl overflow-hidden bg-black border border-[#d0d0d0] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
      
      <div className="h-8 flex items-center relative px-4 border-b border-[#d8d8d8] bg-linear-to-b from-[#e9e9e9] to-[#dcdcdc] backdrop-blur-sm"
        style={{ WebkitAppRegion: "drag" }}
      >
        <div className="flex items-center gap-[7px]">

          <button onClick={() => window.api.close()} style={{ WebkitAppRegion: "no-drag" }}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:bg-red-400/90 transition-colors border border-[#e0443e]"
          />

          <button onClick={() => window.api.minimize()} style={{ WebkitAppRegion: "no-drag" }}
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-yellow-400/90 transition-colors border border-[#dea123]"
          />

          <button onClick={() => window.api.maximize()} style={{ WebkitAppRegion: "no-drag" }}
            className="w-3.5 h-3.5 rounded-full bg-[#28c840] hover:bg-green-400/90 transition-colors border border-[#1dad36]"
          />

        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-[13px] text-[#5e5e5e] font-medium tracking-wide select-none">
          {title}
        </div>
      </div>

      <div className="flex mx-auto w-fit h-fit bg-slate-500/10 backdrop-blur-md overflow-hidden">
        {children}
      </div>
    </div>
  );
}
