"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Map, Maximize2, Filter, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { mockReports } from "@/lib/mock-data"
import { FullscreenMapModal } from "./fullscreen-map-modal"

declare global {
  interface Window {
    L: any
  }
}

export function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        // Load CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Load JS
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => {
          setIsMapLoaded(true)
        }
        document.head.appendChild(script)
      } else if (window.L) {
        setIsMapLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstanceRef.current) {
      const map = window.L.map(mapRef.current).setView([19.076, 72.8777], 11)

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      mapInstanceRef.current = map

      mockReports.forEach((report) => {
        if (report.location.coordinates) {
          const [lat, lng] = report.location.coordinates

          // Determine marker color based on priority
          let markerColor = "#3b82f6" // blue default
          if (report.priority === "critical")
            markerColor = "#dc2626" // red
          else if (report.priority === "high")
            markerColor = "#ea580c" // orange
          else if (report.priority === "medium") markerColor = "#ca8a04" // yellow

          // Create custom marker
          const marker = window.L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: markerColor,
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map)

          // Add popup with report details
          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${report.incidentType}</h3>
              <p class="text-xs text-gray-600 mb-1">${report.user.name}</p>
              <p class="text-xs mb-2">${report.location.address}</p>
              <div class="flex items-center gap-1">
                <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${markerColor}"></span>
                <span class="text-xs capitalize">${report.priority}</span>
              </div>
            </div>
          `)
        }
      })

      const responseUnits = [
        { name: "Unit Alpha-7", lat: 19.0896, lng: 72.8656, type: "medical" },
        { name: "Officer Sharma", lat: 19.0544, lng: 72.8324, type: "police" },
        { name: "Unit Bravo-3", lat: 19.1136, lng: 72.8697, type: "police" },
        { name: "Fire Rescue 12", lat: 19.033, lng: 72.8697, type: "fire" },
      ]

      responseUnits.forEach((unit) => {
        const unitMarker = window.L.circleMarker([unit.lat, unit.lng], {
          radius: 6,
          fillColor: "#10b981", // green
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }).addTo(map)

        unitMarker.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${unit.name}</h3>
            <p class="text-xs text-gray-600">${unit.type.charAt(0).toUpperCase() + unit.type.slice(1)} Unit</p>
            <p class="text-xs text-green-600">Available</p>
          </div>
        `)
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isMapLoaded])

  const refreshMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Live Emergency Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                Live
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFilter(selectedFilter === "all" ? "critical" : "all")}
              >
                <Filter className="h-4 w-4 mr-1" />
                {selectedFilter === "all" ? "All" : "Critical"}
              </Button>
              <Button variant="outline" size="sm" onClick={refreshMap}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsFullscreenOpen(true)}>
                <Maximize2 className="h-4 w-4 mr-1" />
                Fullscreen
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={mapRef} className="w-full h-96 rounded-lg border border-gray-200" style={{ minHeight: "400px" }}>
            {!isMapLoaded && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Loading Map...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Critical Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Response Unit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <FullscreenMapModal isOpen={isFullscreenOpen} onClose={() => setIsFullscreenOpen(false)} />
    </>
  )
}
