import { useState, useCallback } from 'react'

const MAX_HISTORY_SIZE = 15

/**
 * Hook to manage flight history for sparkline visualization
 * Maintains altitude and speed history for each flight
 */
export function useFlightHistory() {
  const [history, setHistory] = useState({})

  const updateHistory = useCallback((flights) => {
    setHistory((prevHistory) => {
      const newHistory = { ...prevHistory }

      flights.forEach((flight) => {
        const [icao, _, __, ___, ____, _____, ______, alt, _______, velocity] = flight

        if (!newHistory[icao]) {
          newHistory[icao] = {
            altitudes: [],
            speeds: [],
            lastUpdate: Date.now(),
          }
        }

        const flightHistory = newHistory[icao]

        // Add new data point
        flightHistory.altitudes.push(alt || 0)
        flightHistory.speeds.push(velocity || 0)

        // Keep only last 15 entries
        if (flightHistory.altitudes.length > MAX_HISTORY_SIZE) {
          flightHistory.altitudes.shift()
          flightHistory.speeds.shift()
        }

        flightHistory.lastUpdate = Date.now()
      })

      // Clean up old flights (no updates in 5 minutes)
      const now = Date.now()
      Object.keys(newHistory).forEach((icao) => {
        if (now - newHistory[icao].lastUpdate > 5 * 60 * 1000) {
          delete newHistory[icao]
        }
      })

      return newHistory
    })
  }, [])

  return { history, updateHistory }
}

/**
 * Normalize data for sparkline rendering (0-1 scale)
 */
export function normalizeData(data, min = 0, max = 13000) {
  return data.map((value) => {
    if (!value) return 0
    return Math.max(0, Math.min(1, (value - min) / (max - min)))
  })
}

/**
 * Get average value from history
 */
export function getAverage(data) {
  if (!data || data.length === 0) return 0
  return data.reduce((a, b) => a + b, 0) / data.length
}

/**
 * Get min/max from history
 */
export function getMinMax(data) {
  if (!data || data.length === 0) return { min: 0, max: 0 }
  return {
    min: Math.min(...data),
    max: Math.max(...data),
  }
}
