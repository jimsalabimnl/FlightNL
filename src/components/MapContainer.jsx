import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getAltitudeColor, getTrailLength, metersToFeet } from '../utils/markerHelpers'

export default function MapContainer({ flights, selectedFlight, onSelectFlight }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([52.1326, 5.2913], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)
    }
  }, [])

  // Update markers when flights change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = {}

    // Add new markers
    flights.forEach((flight) => {
      const [icao, callsign, origin, _, __, lon, lat, alt, onGround, velocity, heading, verticalRate] = flight

      if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
        const color = getAltitudeColor(alt)
        const trailLength = getTrailLength(velocity)
        const isSelected = selectedFlight?.[0] === icao

        // Create marker element with trail effect
        const markerElement = document.createElement('div')
        markerElement.className = `relative w-3 h-3 rounded-full transition-all ${
          isSelected ? 'animate-glow' : ''
        }`
        markerElement.style.backgroundColor = color
        markerElement.style.boxShadow = `0 0 0 2px ${color}`
        markerElement.style.setProperty('--trail-length', `${trailLength}px`)

        // Add trail pseudo-element via CSS
        const style = document.createElement('style')
        style.textContent = `
          .marker-${icao}::before {
            content: '';
            position: absolute;
            top: 50%;
            right: 100%;
            height: 2px;
            background: linear-gradient(to left, ${color}, transparent);
            width: var(--trail-length, 20px);
            opacity: 0.6;
            pointer-events: none;
          }
        `
        markerElement.className += ` marker-${icao}`
        document.head.appendChild(style)

        const marker = L.marker([lat, lon], {
          icon: L.divIcon({
            html: markerElement.outerHTML,
            iconSize: [12, 12],
            className: '',
          }),
        }).addTo(mapInstanceRef.current)

        // Detailed popup
        marker.bindPopup(`
          <div class="glass-panel p-3 rounded-lg text-xs max-w-xs">
            <div class="text-white font-bold text-sm">${callsign || 'N/A'}</div>
            <div class="text-slate-300 mt-1">ICAO: <span class="text-cyan-300">${icao}</span></div>
            <div class="text-slate-300">Altitude: <span class="text-yellow-300">${metersToFeet(alt)} ft</span></div>
            <div class="text-slate-300">Heading: <span class="text-yellow-300">${heading ? heading.toFixed(0) : 'N/A'}°</span></div>
            <div class="text-slate-300">V/Speed: <span class="text-yellow-300">${verticalRate ? verticalRate.toFixed(1) : 'N/A'} m/s</span></div>
            <div class="text-slate-300">Position: <span class="text-cyan-300">${lat.toFixed(3)}, ${lon.toFixed(3)}</span></div>
          </div>
        `)

        marker.on('click', () => {
          onSelectFlight(flight)
          marker.openPopup()
        })

        markersRef.current[icao] = marker
      }
    })
  }, [flights, selectedFlight, onSelectFlight])

  // Center on selected flight
  useEffect(() => {
    if (selectedFlight && mapInstanceRef.current) {
      const [_, __, ___, ____, _____, lon, lat] = selectedFlight
      if (lat && lon) {
        mapInstanceRef.current.setView([lat, lon], 10)
      }
    }
  }, [selectedFlight])

  return <div ref={mapRef} id="map" className="absolute inset-0 z-0" />
}
