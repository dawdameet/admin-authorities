import { ReportManagement } from "@/components/report-management"
import { ReportFilters } from "@/components/report-filters"
import { ReportStats } from "@/components/report-stats"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Report Management</h1>
              <p className="text-sm text-muted-foreground">Manage and track all SOS emergency reports</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <ReportStats />
          <ReportFilters />
          <ReportManagement />
        </div>
      </main>
    </div>
  )
}
