import { StatusTracking } from "@/components/status-tracking"
import { ResponseUnits } from "@/components/response-units"
import { LiveMap } from "@/components/live-map"

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Status Tracking</h1>
              <p className="text-sm text-muted-foreground">Real-time tracking of emergency responses and units</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live Updates</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LiveMap />
            <StatusTracking />
          </div>
          <div>
            <ResponseUnits />
          </div>
        </div>
      </main>
    </div>
  )
}
