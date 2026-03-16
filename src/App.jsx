import { useState, useEffect, useMemo } from 'react'
import MapContainer from './components/MapContainer'
import FlightDetailsDrawer from './components/FlightDetailsDrawer'
import TopBar from './components/TopBar'
import BottomHUD from './components/BottomHUD'
import { useFlightHistory } from './hooks/useFlightHistory'

function App() {
  const [flights, setFlights] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { history, updateHistory } = useFlightHistory()

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('/api/flights')
        const data = await response.json()
        const states = data.states || []
        setFlights(states)
        updateHistory(states)
      } catch (error) {
        console.error('Error fetching flights:', error)
      }
    }

    fetchFlights()
    const interval = setInterval(fetchFlights, 30000)
    return () => clearInterval(interval)
  }, [updateHistory])

  // Filter flights based on search
  const filteredFlights = useMemo(() => {
    if (!searchQuery) return flights

    return flights.filter((flight) => {
      const [icao, callsign] = flight
      const query = searchQuery.toLowerCase()
      return (
        icao?.toLowerCase().includes(query) ||
        callsign?.toLowerCase().includes(query)
      )
    })
  }, [flights, searchQuery])

  // Count active flights in Dutch airspace (approximate)
  const dutchFlights = useMemo(() => {
    return flights.filter((flight) => {
      const [_, __, ___, ____, _____, lon, lat] = flight
      // Netherlands airspace (approximate): 2°E-7°E, 50.75°N-53.5°N
      return lat >= 50.75 && lat <= 53.5 && lon >= 2 && lon <= 7
    }).length
  }, [flights])

  return (
    <div className="relative h-screen w-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      <MapContainer
        flights={filteredFlights}
        selectedFlight={selectedFlight}
        onSelectFlight={setSelectedFlight}
        history={history}
      />

      {/* UI Overlays */}
      <TopBar
        onSearch={setSearchQuery}
        flightCount={filteredFlights.length}
      />
      <BottomHUD
        flightCount={flights.length}
        activeFlightCount={dutchFlights}
      />

      <FlightDetailsDrawer
        flight={selectedFlight}
        history={history}
        onClose={() => setSelectedFlight(null)}
        isOpen={!!selectedFlight}
      />
    </div>
  )
}

export default App
