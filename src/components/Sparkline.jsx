/**
 * Simple SVG sparkline component for visualizing flight data trends
 */
export default function Sparkline({ data = [], height = 30, color = '#22D3EE', minY = 0, maxY = 100 }) {
  if (!data || data.length === 0) {
    return (
      <svg width="100%" height={height} className="w-full">
        <text x="50%" y="50%" textAnchor="middle" dy="0.3em" className="text-xs fill-slate-400">
          No data
        </text>
      </svg>
    )
  }

  const width = 100
  const padding = 2
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Generate points for the line path
  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * chartWidth
    const normalized = data.length === 1 ? 0.5 : (value - minY) / (maxY - minY || 1)
    const y = padding + (1 - normalized) * chartHeight
    return { x, y, value }
  })

  // Generate SVG path
  let pathData = ''
  points.forEach((point, index) => {
    if (index === 0) {
      pathData += `M ${point.x} ${point.y}`
    } else {
      pathData += ` L ${point.x} ${point.y}`
    }
  })

  // Generate fill area (gradient)
  let areaPath = pathData + ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  const currentValue = data[data.length - 1]
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)

  return (
    <div className="flex flex-col gap-1">
      <svg
        width="100%"
        height={height}
        className="w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={`${color}20`} strokeWidth="0.5" />

        {/* Area fill */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#gradient-${color})`} />

        {/* Line path */}
        <path d={pathData} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Current value point */}
        {points.length > 0 && (
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2" fill={color} />
        )}
      </svg>

      {/* Stats row */}
      <div className="flex justify-between text-xs text-slate-400 px-1">
        <span>Min: {minValue.toFixed(0)}</span>
        <span>Cur: {currentValue.toFixed(0)}</span>
        <span>Max: {maxValue.toFixed(0)}</span>
      </div>
    </div>
  )
}
