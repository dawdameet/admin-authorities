import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockSOSReports } from "@/lib/mock-data"
import { MapPin, Clock, User, Phone, Eye, MoreHorizontal } from "lucide-react"

export function RecentReports() {
  const recentReports = mockSOSReports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">All SOS Reports</CardTitle>
          <Button variant="outline" size="sm">
            View All Reports
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium">{report.id}</span>
                  <Badge className={getPriorityColor(report.priority)} size="sm">
                    {report.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(report.status)} size="sm">
                    {report.status.replace("-", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(report.timestamp)} at {formatTime(report.timestamp)}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{report.user.name}</p>
                    <p className="text-xs text-muted-foreground">{report.user.nationality}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{report.user.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm">{report.location.address}</p>
                    {report.location.landmark && (
                      <p className="text-xs text-muted-foreground">{report.location.landmark}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium capitalize mb-1">{report.incident.type} Emergency</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{report.incident.description}</p>
                </div>

                <div>
                  {report.response.assignedTo ? (
                    <div>
                      <p className="text-sm font-medium">Assigned to:</p>
                      <p className="text-xs text-muted-foreground">{report.response.assignedTo}</p>
                      {report.response.estimatedArrival && (
                        <p className="text-xs text-blue-600 mt-1">
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

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {report.incident.photos.length > 0 && (
                    <Badge variant="secondary" size="sm">
                      {report.incident.photos.length} Photo{report.incident.photos.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {report.response.notes.length > 0 && (
                    <Badge variant="secondary" size="sm">
                      {report.response.notes.length} Note{report.response.notes.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
