export default function MacWindow({ title = "", children }) {
  return (
    <div className="w-[800px] rounded-xl overflow-hidden bg-[#f8f8f8] border border-[#d0d0d0] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
      <div className=" h-8 flex items-center relative px-4 border-b border-[#d8d8d8] bg-gradient-to-b from-[#e9e9e9] to-[#dcdcdc] backdrop-blur-sm
        "
        style={{
          WebkitAppRegion: "drag"
        }}
      >
        <div className="flex items-center gap-[7px]">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1dad36]"></div>
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
