export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Top-leftish green flow */}
      <div
        className="absolute top-[-20rem] left-[-20rem] md:left-[-30rem] lg:left-[-25rem] w-[60rem] h-[60rem] 
                   bg-gradient-to-br from-emerald-300/20 via-emerald-400/10 to-transparent 
                   rounded-full blur-[100px] opacity-60 animate-pulse-slow"
        style={{ animationDuration: "10s" }}
      />
      {/* Top-rightish blue/purple flow */}
      <div
        className="absolute top-[-15rem] right-[-20rem] md:right-[-30rem] lg:right-[-25rem] w-[55rem] h-[55rem] 
                   bg-gradient-to-bl from-indigo-300/20 via-purple-400/10 to-transparent 
                   rounded-full blur-[100px] opacity-50 animate-pulse-slow-delay"
        style={{ animationDuration: "12s", animationDelay: "2s" }}
      />
      {/* Bottom-center subtle green flow */}
      <div
        className="absolute bottom-[-20rem] left-1/2 -translate-x-1/2 w-[70rem] h-[40rem] 
                   bg-gradient-to-t from-emerald-200/15 via-emerald-300/5 to-transparent 
                   rounded-[50%] blur-[120px] opacity-40 animate-pulse-slow"
        style={{ animationDuration: "15s", animationDelay: "1s" }}
      />
    </div>
  )
}
