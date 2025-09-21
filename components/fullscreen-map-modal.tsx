"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RefreshCw, Map } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { mockReports } from "@/lib/mock-data"

interface FullscreenMapModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FullscreenMapModal({ isOpen, onClose }: FullscreenMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

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
    if (isMapLoaded && mapRef.current && isOpen && !mapInstanceRef.current) {
      setTimeout(() => {
        const map = window.L.map(mapRef.current).setView([19.076, 72.8777], 11) // Mumbai coordinates

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        mapInstanceRef.current = map

        // Add emergency reports
        mockReports.forEach((report) => {
          if (report.location.coordinates) {
            const [lat, lng] = report.location.coordinates

            let markerColor = "#3b82f6"
            if (report.priority === "critical") markerColor = "#dc2626"
            else if (report.priority === "high") markerColor = "#ea580c"
            else if (report.priority === "medium") markerColor = "#ca8a04"

            const marker = window.L.circleMarker([lat, lng], {
              radius: 10,
              fillColor: markerColor,
              color: "#ffffff",
              weight: 3,
              opacity: 1,
              fillOpacity: 0.8,
            }).addTo(map)

            marker.bindPopup(`
              <div class="p-3">
                <h3 class="font-semibold text-sm mb-1">${report.incidentType}</h3>
                <p class="text-xs text-gray-600 mb-1">${report.user.name}</p>
                <p class="text-xs mb-2">${report.location.address}</p>
                <div class="flex items-center gap-1 mb-2">
                  <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${markerColor}"></span>
                  <span class="text-xs capitalize font-medium">${report.priority} Priority</span>
                </div>
                <p class="text-xs text-gray-500">${report.timestamp.toLocaleString()}</p>
              </div>
            `)
          }
        })

        // Add response units
        const responseUnits = [
          { name: "Unit Alpha-7", lat: 19.0896, lng: 72.8656, type: "medical" },
          { name: "Officer Sharma", lat: 19.0544, lng: 72.8324, type: "police" },
          { name: "Unit Bravo-3", lat: 19.1136, lng: 72.8697, type: "police" },
          { name: "Fire Rescue 12", lat: 19.033, lng: 72.8697, type: "fire" },
        ]

        responseUnits.forEach((unit) => {
          const unitMarker = window.L.circleMarker([unit.lat, unit.lng], {
            radius: 8,
            fillColor: "#10b981",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
          }).addTo(map)

          unitMarker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${unit.name}</h3>
              <p class="text-xs text-gray-600">${unit.type.charAt(0).toUpperCase() + unit.type.slice(1)} Unit</p>
              <p class="text-xs text-green-600 font-medium">Available</p>
            </div>
          `)
        })
      }, 100)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isMapLoaded, isOpen])

  const refreshMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        <div className="flex flex-col h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-3">
              <Map className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Live Emergency Map - Full Screen</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                Live
              </Badge>
            </div>
            <div className="flex items-center gap-2">
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
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 p-4">
            <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-200">
              {!isMapLoaded && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Loading Full Screen Map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 p-4 border-t bg-card text-xs">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
