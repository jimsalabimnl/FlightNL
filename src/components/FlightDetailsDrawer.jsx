import { X } from 'lucide-react'
import Sparkline from './Sparkline'
import { metersToFeet } from '../utils/markerHelpers'

export default function FlightDetailsDrawer({ flight, history, onClose, isOpen }) {
  if (!isOpen || !flight) return null

  const [icao, callsign, origin, _, __, lon, lat, alt, onGround, velocity, heading, verticalRate] = flight

  const flightHistory = history[icao] || { altitudes: [], speeds: [] }
  const altitudeData = flightHistory.altitudes || []
  const speedData = flightHistory.speeds || []

  // Create progress percentage for gauges
  const altitudePercent = alt ? Math.min(100, (alt / 13000) * 100) : 0
  const speedPercent = velocity ? Math.min(100, (velocity / 300) * 100) : 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer - Desktop (right side) */}
      <div className="hidden md:flex fixed right-0 top-0 w-96 h-screen z-50 flex-col gap-4 p-6 glass-panel rounded-l-3xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{callsign || 'Unknown'}</h2>
            <p className="text-sm text-slate-400">ICAO: {icao}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Flight Status */}
        <div className="bg-slate-800/50 rounded-xl p-3">
          <div className="text-sm text-slate-300">
            Status: <span className={onGround ? 'text-orange-400' : 'text-green-400'}>
              {onGround ? '🚫 On Ground' : '✈️ In Flight'}
            </span>
          </div>
        </div>

        {/* Altitude Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-300">Altitude</label>
            <span className="text-lg font-bold text-yellow-300">{metersToFeet(alt)} ft</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-cyan-500 transition-all"
              style={{ width: `${altitudePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0 ft</span>
            <span>13,000 ft</span>
          </div>
        </div>

        {/* Speed Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-300">Speed</label>
            <span className="text-lg font-bold text-yellow-300">{velocity ? velocity.toFixed(1) : 'N/A'} m/s</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 transition-all"
              style={{ width: `${speedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0 m/s</span>
            <span>300 m/s</span>
          </div>
        </div>

        {/* Sparklines */}
        <div className="space-y-4 mt-4 border-t border-slate-700 pt-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Altitude Trend</h3>
            <Sparkline
              data={altitudeData}
              height={40}
              color="#22D3EE"
              minY={0}
              maxY={13000}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Speed Trend</h3>
            <Sparkline
              data={speedData}
              height={40}
              color="#3B82F6"
              minY={0}
              maxY={300}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 border-t border-slate-700 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Heading</span>
            <span className="text-white font-mono">{heading ? heading.toFixed(0) : 'N/A'}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">V/Speed</span>
            <span className="text-white font-mono">{verticalRate ? verticalRate.toFixed(2) : 'N/A'} m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Latitude</span>
            <span className="text-white font-mono">{lat.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Longitude</span>
            <span className="text-white font-mono">{lon.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Origin</span>
            <span className="text-white font-mono">{origin || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet - Mobile (<md) */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 flex-col gap-3 p-4 glass-panel rounded-t-3xl max-h-[60vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="flex justify-center mb-2">
          <div className="w-12 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{callsign || 'Unknown'}</h2>
            <p className="text-xs text-slate-400">ICAO: {icao}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Compact gauges */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span>Alt: {metersToFeet(alt)} ft</span>
            <span>Speed: {velocity ? velocity.toFixed(1) : 'N/A'} m/s</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${altitudePercent}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${speedPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400">Heading</span>
            <div className="text-white font-mono">{heading ? heading.toFixed(0) : 'N/A'}°</div>
          </div>
          <div>
            <span className="text-slate-400">V/Speed</span>
            <div className="text-white font-mono">{verticalRate ? verticalRate.toFixed(2) : 'N/A'} m/s</div>
          </div>
          <div>
            <span className="text-slate-400">Pos</span>
            <div className="text-white font-mono text-xs">{lat.toFixed(2)}, {lon.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-slate-400">Status</span>
            <div className={onGround ? 'text-orange-400' : 'text-green-400'}>
              {onGround ? 'Ground' : 'Flying'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
