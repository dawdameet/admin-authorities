"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Clock, Phone, Radio } from "lucide-react"

interface ResponseUnit {
  id: string
  name: string
  type: "police" | "medical" | "fire" | "tourist-guide"
  status: "available" | "dispatched" | "on-scene" | "returning"
  location: string
  assignedTo?: string
  lastUpdate: Date
  contact: string
}

export function ResponseUnits() {
  const units: ResponseUnit[] = [
    {
      id: "unit-1",
      name: "Unit Alpha-7",
      type: "medical",
      status: "on-scene",
      location: "123 Tourist Plaza",
      assignedTo: "SOS-001",
      lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
      contact: "Radio Ch. 7",
    },
    {
      id: "unit-2",
      name: "Officer Martinez",
      type: "police",
      status: "dispatched",
      location: "En route to Market St",
      assignedTo: "SOS-002",
      lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
      contact: "+1-555-0199",
    },
    {
      id: "unit-3",
      name: "Tourist Guide Unit",
      type: "tourist-guide",
      status: "available",
      location: "Central Station",
      lastUpdate: new Date(Date.now() - 10 * 60 * 1000),
      contact: "+1-555-0177",
    },
    {
      id: "unit-4",
      name: "Unit Bravo-3",
      type: "police",
      status: "available",
      location: "Harbor Patrol",
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
      contact: "Radio Ch. 3",
    },
    {
      id: "unit-5",
      name: "Fire Rescue 12",
      type: "fire",
      status: "returning",
      location: "Returning to Station",
      lastUpdate: new Date(Date.now() - 8 * 60 * 1000),
      contact: "Radio Ch. 12",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "dispatched":
        return "bg-blue-100 text-blue-800"
      case "on-scene":
        return "bg-yellow-100 text-yellow-800"
      case "returning":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "police":
        return "🚔"
      case "medical":
        return "🚑"
      case "fire":
        return "🚒"
      case "tourist-guide":
        return "🗺️"
      default:
        return "🚐"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "police":
        return "bg-blue-600 text-white"
      case "medical":
        return "bg-red-600 text-white"
      case "fire":
        return "bg-orange-600 text-white"
      case "tourist-guide":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    return `${Math.floor(diffInMinutes / 60)}h ago`
  }

  const availableUnits = units.filter((unit) => unit.status === "available").length
  const activeUnits = units.filter((unit) => unit.status === "dispatched" || unit.status === "on-scene").length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Response Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{availableUnits}</div>
              <div className="text-xs text-green-700">Available</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeUnits}</div>
              <div className="text-xs text-blue-700">Active</div>
            </div>
          </div>
          <Button className="w-full bg-transparent" variant="outline">
            <Radio className="h-4 w-4 mr-2" />
            Dispatch New Unit
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {units.map((unit) => (
              <div key={unit.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(unit.type)}</span>
                    <div>
                      <p className="font-medium text-sm">{unit.name}</p>
                      <Badge className={getTypeColor(unit.type)} size="sm">
                        {unit.type.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(unit.status)} size="sm">
                    {unit.status.replace("-", " ")}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {unit.location}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {unit.contact}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Last update: {formatTimeAgo(unit.lastUpdate)}
                  </div>

                  {unit.assignedTo && <div className="text-blue-600 font-medium">Assigned to: {unit.assignedTo}</div>}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <MapPin className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
