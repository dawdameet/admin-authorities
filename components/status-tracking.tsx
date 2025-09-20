"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { mockSOSReports, type SOSReport } from "@/lib/mock-data"
import { Clock, MapPin, User, CheckCircle, AlertTriangle, Navigation } from "lucide-react"

interface StatusUpdate {
  id: string
  reportId: string
  timestamp: Date
  status: string
  message: string
  location?: string
}

export function StatusTracking() {
  const [activeReports, setActiveReports] = useState<SOSReport[]>([])
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])

  useEffect(() => {
    // Filter active reports
    const active = mockSOSReports.filter((report) => report.status === "pending" || report.status === "in-progress")
    setActiveReports(active)

    // Mock status updates
    const updates: StatusUpdate[] = [
      {
        id: "update-1",
        reportId: "SOS-001",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: "dispatched",
        message: "Unit Alpha-7 dispatched to location",
        location: "123 Tourist Plaza",
      },
      {
        id: "update-2",
        reportId: "SOS-001",
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        status: "en-route",
        message: "Unit Alpha-7 en route, ETA 5 minutes",
      },
      {
        id: "update-3",
        reportId: "SOS-002",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: "investigating",
        message: "Officer Martinez investigating theft report",
        location: "456 Market Street",
      },
      {
        id: "update-4",
        reportId: "SOS-004",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        status: "pending",
        message: "Awaiting unit assignment for bicycle accident",
        location: "321 Waterfront Drive",
      },
    ]
    setStatusUpdates(updates)
  }, [])

  const getProgressValue = (status: string) => {
    switch (status) {
      case "pending":
        return 10
      case "dispatched":
        return 30
      case "en-route":
        return 60
      case "on-scene":
        return 80
      case "resolved":
        return 100
      default:
        return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800"
      case "dispatched":
        return "bg-blue-100 text-blue-800"
      case "en-route":
        return "bg-yellow-100 text-yellow-800"
      case "on-scene":
        return "bg-green-100 text-green-800"
      case "resolved":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Active Emergency Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeReports.map((report) => {
              const latestUpdate = statusUpdates
                .filter((update) => update.reportId === report.id)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

              const currentStatus = latestUpdate?.status || report.status
              const progressValue = getProgressValue(currentStatus)

              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{report.id}</span>
                      <Badge variant="destructive" size="sm">
                        {report.priority}
                      </Badge>
                      <Badge className={getStatusColor(currentStatus)} size="sm">
                        {currentStatus.replace("-", " ")}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-3 w-3 mr-1" />
                      Track
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{report.user.name}</p>
                        <p className="text-xs text-muted-foreground">{report.incident.type} emergency</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{report.location.address}</p>
                        <p className="text-xs text-muted-foreground">{report.location.landmark}</p>
                      </div>
                    </div>

                    <div>
                      {report.response.assignedTo ? (
                        <div>
                          <p className="text-sm font-medium">Assigned: {report.response.assignedTo}</p>
                          {report.response.estimatedArrival && (
                            <p className="text-xs text-blue-600">
                              ETA:{" "}
                              {report.response.estimatedArrival.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-red-600">⚠ Awaiting assignment</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Response Progress</span>
                      <span className="font-medium">{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Reported</span>
                      <span>Dispatched</span>
                      <span>En Route</span>
                      <span>On Scene</span>
                      <span>Resolved</span>
                    </div>
                  </div>

                  {latestUpdate && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Latest Update</span>
                        <span className="text-xs text-blue-600">{formatTimeAgo(latestUpdate.timestamp)}</span>
                      </div>
                      <p className="text-sm text-blue-700">{latestUpdate.message}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Status Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusUpdates
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((update) => (
                <div key={update.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-medium">{update.reportId}</span>
                      <Badge className={getStatusColor(update.status)} size="sm">
                        {update.status.replace("-", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(update.timestamp)}</span>
                    </div>
                    <p className="text-sm">{update.message}</p>
                    {update.location && <p className="text-xs text-muted-foreground mt-1">📍 {update.location}</p>}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
