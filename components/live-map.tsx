import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Map, Maximize2, Filter, RefreshCw } from "lucide-react"

export function LiveMap() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Live Emergency Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Live
            </Badge>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-1" />
              Fullscreen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <div className="absolute inset-4 bg-gradient-to-br from-blue-50 to-green-50 rounded border-2 border-dashed border-gray-300">
            <div className="relative w-full h-full">
              {/* Mock emergency locations */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-blue-600 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-yellow-600 rounded-full animate-pulse border-2 border-white shadow-lg"></div>

              {/* Mock response units */}
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-600 rounded-full border border-white"></div>
              <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-green-600 rounded-full border border-white"></div>
            </div>
          </div>

          <div className="text-center z-10">
            <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Interactive Emergency Map</p>
            <p className="text-sm text-gray-400">Real-time locations of SOS reports and response units</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Critical Emergency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Active Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Response Unit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
