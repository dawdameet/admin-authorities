import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dashboardStats } from "@/lib/mock-data"
import { AlertTriangle, Clock, CheckCircle, Activity } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Reports",
      value: dashboardStats.totalReports,
      icon: Activity,
      description: "All SOS reports today",
      color: "text-blue-600",
    },
    {
      title: "Active Emergencies",
      value: dashboardStats.activeReports,
      icon: AlertTriangle,
      description: "Requiring immediate attention",
      color: "text-red-600",
    },
    {
      title: "Resolved Today",
      value: dashboardStats.resolvedToday,
      icon: CheckCircle,
      description: "Successfully handled",
      color: "text-green-600",
    },
    {
      title: "Avg Response Time",
      value: dashboardStats.averageResponseTime,
      icon: Clock,
      description: "Current performance",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              {stat.title === "Active Emergencies" && stat.value > 0 && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  Urgent Action Required
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
