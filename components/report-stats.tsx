import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockSOSReports } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function ReportStats() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayReports = mockSOSReports.filter((r) => r.timestamp.toDateString() === today.toDateString()).length

  const pendingReports = mockSOSReports.filter((r) => r.status === "pending").length
  const inProgressReports = mockSOSReports.filter((r) => r.status === "in-progress").length
  const resolvedReports = mockSOSReports.filter((r) => r.status === "resolved").length
  const criticalReports = mockSOSReports.filter((r) => r.priority === "critical").length

  const stats = [
    {
      title: "Today's Reports",
      value: todayReports,
      change: "+12%",
      trend: "up" as const,
      description: "vs yesterday",
    },
    {
      title: "Pending",
      value: pendingReports,
      change: "-8%",
      trend: "down" as const,
      description: "awaiting response",
    },
    {
      title: "In Progress",
      value: inProgressReports,
      change: "0%",
      trend: "neutral" as const,
      description: "being handled",
    },
    {
      title: "Resolved",
      value: resolvedReports,
      change: "+15%",
      trend: "up" as const,
      description: "successfully closed",
    },
  ]

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      case "neutral":
        return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "neutral":
        return "text-gray-600"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(stat.trend)}`}>
                {getTrendIcon(stat.trend)}
                {stat.change}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
