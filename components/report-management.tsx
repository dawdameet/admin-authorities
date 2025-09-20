"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockSOSReports, type SOSReport } from "@/lib/mock-data"
import { MapPin, User, Camera, FileText, Edit, AlertTriangle } from "lucide-react"

export function ReportManagement() {
  const [reports, setReports] = useState<SOSReport[]>(mockSOSReports)
  const [selectedReport, setSelectedReport] = useState<SOSReport | null>(null)
  const [editingReport, setEditingReport] = useState<SOSReport | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 border-red-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "false-alarm":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const updateReportStatus = (reportId: string, newStatus: SOSReport["status"]) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
  }

  const updateReportAssignment = (reportId: string, assignedTo: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, response: { ...report.response, assignedTo } } : report,
      ),
    )
  }

  const addNote = (reportId: string, note: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              response: {
                ...report.response,
                notes: [...report.response.notes, note],
              },
            }
          : report,
      ),
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Reports ({reports.length})</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">{report.id}</span>
                    <Badge className={getPriorityColor(report.priority)} size="sm">
                      {report.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(report.status)} size="sm">
                      {report.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{formatTime(report.timestamp)}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            Report {selectedReport?.id}
                            <Badge className={getPriorityColor(selectedReport?.priority || "low")}>
                              {selectedReport?.priority}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>
                        {selectedReport && <ReportDetails report={selectedReport} />}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{report.user.name}</p>
                      <p className="text-xs text-muted-foreground">{report.user.nationality}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{report.location.address}</p>
                      <p className="text-xs text-muted-foreground">{report.location.landmark}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium capitalize">{report.incident.type} Emergency</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{report.incident.description}</p>
                  </div>

                  <div className="space-y-2">
                    <Select
                      value={report.status}
                      onValueChange={(value) => updateReportStatus(report.id, value as SOSReport["status"])}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="false-alarm">False Alarm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {report.response.assignedTo ? (
                      <span>
                        Assigned to: <strong>{report.response.assignedTo}</strong>
                      </span>
                    ) : (
                      <span className="text-red-600">⚠ Awaiting assignment</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage Report {report.id}</DialogTitle>
                        </DialogHeader>
                        <ReportManagementForm
                          report={report}
                          onUpdateAssignment={updateReportAssignment}
                          onAddNote={addNote}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportDetails({ report }: { report: SOSReport }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Tourist Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-medium">{report.user.name}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <p className="font-mono text-sm">{report.user.phone}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm">{report.user.email}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Nationality</Label>
              <p>{report.user.nationality}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Address</Label>
              <p>{report.location.address}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Landmark</Label>
              <p>{report.location.landmark || "None specified"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Coordinates</Label>
              <p className="font-mono text-sm">
                {report.location.latitude}, {report.location.longitude}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Type</Label>
            <p className="capitalize">{report.incident.type} Emergency</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <p>{report.incident.description}</p>
          </div>
          {report.incident.photos.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground">Photos</Label>
              <div className="flex gap-2 mt-2">
                {report.incident.photos.map((photo, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Response Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Assigned To</Label>
            <p>{report.response.assignedTo || "Not assigned"}</p>
          </div>
          {report.response.estimatedArrival && (
            <div>
              <Label className="text-xs text-muted-foreground">Estimated Arrival</Label>
              <p>{report.response.estimatedArrival.toLocaleString()}</p>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <div className="space-y-2 mt-2">
              {report.response.notes.map((note, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportManagementForm({
  report,
  onUpdateAssignment,
  onAddNote,
}: {
  report: SOSReport
  onUpdateAssignment: (reportId: string, assignedTo: string) => void
  onAddNote: (reportId: string, note: string) => void
}) {
  const [assignedTo, setAssignedTo] = useState(report.response.assignedTo || "")
  const [newNote, setNewNote] = useState("")

  const handleUpdateAssignment = () => {
    if (assignedTo.trim()) {
      onUpdateAssignment(report.id, assignedTo.trim())
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(report.id, newNote.trim())
      setNewNote("")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="assigned-to">Assign to Response Unit</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="assigned-to"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Enter unit name or officer ID"
          />
          <Button onClick={handleUpdateAssignment}>Update</Button>
        </div>
      </div>

      <div>
        <Label htmlFor="new-note">Add Response Note</Label>
        <div className="space-y-2 mt-1">
          <Textarea
            id="new-note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter response note or update..."
            rows={3}
          />
          <Button onClick={handleAddNote} className="w-full">
            Add Note
          </Button>
        </div>
      </div>
    </div>
  )
}
