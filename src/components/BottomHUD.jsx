export default function BottomHUD({ flightCount, activeFlightCount = 0 }) {
  return (
    <div className="absolute bottom-6 left-6 z-10">
      <div className="glass-panel px-6 py-4 rounded-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-lg font-bold text-cyan-300">
              {flightCount}
            </span>
            <span className="text-sm text-slate-300">
              actieve vluchten
            </span>
          </div>
          {activeFlightCount > 0 && (
            <div className="text-xs text-slate-400">
              {activeFlightCount} in uw airspace
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
