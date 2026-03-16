/**
 * Get color based on altitude
 * < 1500m: Orange
 * 1500m - 9000m: Yellow
 * > 9000m: Cyan
 */
export function getAltitudeColor(altitude) {
  if (!altitude) return '#FBBF24' // yellow (default)
  if (altitude < 1500) return '#F97316' // orange
  if (altitude > 9000) return '#22D3EE' // cyan
  return '#FBBF24' // yellow
}

/**
 * Calculate trail length based on velocity
 * Scale: 0-300 m/s -> 0-40px
 */
export function getTrailLength(velocity) {
  if (!velocity) return 20
  return Math.min((velocity / 5), 40)
}

/**
 * Convert meters to feet (for display)
 */
export function metersToFeet(meters) {
  if (!meters) return 'N/A'
  return (meters / 0.3048).toFixed(0)
}

/**
 * Determine if aircraft is on ground
 */
export function isAircraftOnGround(onGround) {
  return onGround === true || onGround === 1
}
