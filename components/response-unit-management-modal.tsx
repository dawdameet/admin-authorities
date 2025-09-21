"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Phone, Clock, AlertTriangle, CheckCircle, XCircle, Send } from "lucide-react"
import { useState } from "react"

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

interface ResponseUnitManagementModalProps {
  isOpen: boolean
  onClose: () => void
  units: ResponseUnit[]
  onDispatchUnit: (unitId: string, reportId: string, instructions: string) => void
  onUpdateUnitStatus: (unitId: string, status: string, location: string) => void
}

export function ResponseUnitManagementModal({
  isOpen,
  onClose,
  units,
  onDispatchUnit,
  onUpdateUnitStatus,
}: ResponseUnitManagementModalProps) {
  const [selectedUnit, setSelectedUnit] = useState<ResponseUnit | null>(null)
  const [dispatchMode, setDispatchMode] = useState(false)
  const [dispatchData, setDispatchData] = useState({
    reportId: "",
    instructions: "",
  })
  const [updateData, setUpdateData] = useState({
    status: "",
    location: "",
  })

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

  const handleDispatch = () => {
    if (selectedUnit && dispatchData.reportId && dispatchData.instructions) {
      onDispatchUnit(selectedUnit.id, dispatchData.reportId, dispatchData.instructions)
      setDispatchMode(false)
      setDispatchData({ reportId: "", instructions: "" })
      setSelectedUnit(null)
    }
  }

  const handleStatusUpdate = () => {
    if (selectedUnit && updateData.status && updateData.location) {
      onUpdateUnitStatus(selectedUnit.id, updateData.status, updateData.location)
      setUpdateData({ status: "", location: "" })
      setSelectedUnit(null)
    }
  }

  const availableUnits = units.filter((unit) => unit.status === "available")
  const activeUnits = units.filter((unit) => unit.status === "dispatched" || unit.status === "on-scene")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            Response Unit Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{availableUnits.length}</div>
              <div className="text-xs text-green-700">Available</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeUnits.length}</div>
              <div className="text-xs text-blue-700">Active</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {units.filter((u) => u.status === "on-scene").length}
              </div>
              <div className="text-xs text-yellow-700">On Scene</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {units.filter((u) => u.status === "returning").length}
              </div>
              <div className="text-xs text-gray-700">Returning</div>
            </div>
          </div>

          {/* Unit Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Units List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">All Response Units</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedUnit?.id === unit.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedUnit(unit)}
                  >
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

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {unit.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(unit.lastUpdate)}
                      </div>
                      {unit.assignedTo && (
                        <div className="text-blue-600 font-medium">Assigned to: {unit.assignedTo}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unit Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Unit Actions</h3>

              {selectedUnit ? (
                <div className="space-y-4">
                  {/* Selected Unit Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getTypeIcon(selectedUnit.type)}</span>
                      <div>
                        <h4 className="font-semibold">{selectedUnit.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(selectedUnit.type)} size="sm">
                            {selectedUnit.type.replace("-", " ")}
                          </Badge>
                          <Badge className={getStatusColor(selectedUnit.status)} size="sm">
                            {selectedUnit.status.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUnit.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUnit.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Last update: {formatTimeAgo(selectedUnit.lastUpdate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {selectedUnit.status === "available" && (
                      <Button className="w-full" onClick={() => setDispatchMode(true)}>
                        <Send className="h-4 w-4 mr-2" />
                        Dispatch Unit
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setUpdateData({ status: selectedUnit.status, location: selectedUnit.location })}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                  </div>

                  {/* Dispatch Form */}
                  {dispatchMode && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-semibold">Dispatch Unit</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="reportId">Report ID</Label>
                          <Input
                            id="reportId"
                            placeholder="e.g., SOS-001"
                            value={dispatchData.reportId}
                            onChange={(e) => setDispatchData((prev) => ({ ...prev, reportId: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="instructions">Dispatch Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Special instructions for the response unit..."
                            value={dispatchData.instructions}
                            onChange={(e) => setDispatchData((prev) => ({ ...prev, instructions: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleDispatch}
                            disabled={!dispatchData.reportId || !dispatchData.instructions}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Dispatch
                          </Button>
                          <Button variant="outline" onClick={() => setDispatchMode(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Update Form */}
                  {updateData.status && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-semibold">Update Unit Status</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="newStatus">New Status</Label>
                          <Select
                            value={updateData.status}
                            onValueChange={(value) => setUpdateData((prev) => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="dispatched">Dispatched</SelectItem>
                              <SelectItem value="on-scene">On Scene</SelectItem>
                              <SelectItem value="returning">Returning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="newLocation">Current Location</Label>
                          <Input
                            id="newLocation"
                            placeholder="Update current location..."
                            value={updateData.location}
                            onChange={(e) => setUpdateData((prev) => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleStatusUpdate} disabled={!updateData.status || !updateData.location}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                          <Button variant="outline" onClick={() => setUpdateData({ status: "", location: "" })}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a response unit to manage</p>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <XCircle className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
