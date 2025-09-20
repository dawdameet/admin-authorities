// Mock data structure for SOS reports from tourist safety app
export interface SOSReport {
  id: string
  timestamp: Date
  status: "pending" | "in-progress" | "resolved" | "false-alarm"
  priority: "low" | "medium" | "high" | "critical"
  user: {
    name: string
    phone: string
    email: string
    nationality: string
  }
  location: {
    latitude: number
    longitude: number
    address: string
    landmark?: string
  }
  incident: {
    type: "medical" | "theft" | "assault" | "lost" | "accident" | "other"
    description: string
    photos: string[]
  }
  response: {
    assignedTo?: string
    estimatedArrival?: Date
    notes: string[]
  }
}

// Mock SOS reports data
export const mockSOSReports: SOSReport[] = [
  {
    id: "SOS-001",
    timestamp: new Date("2024-01-15T14:30:00Z"),
    status: "critical",
    priority: "critical",
    user: {
      name: "Sarah Johnson",
      phone: "+1-555-0123",
      email: "sarah.j@email.com",
      nationality: "USA",
    },
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Tourist Plaza, Downtown",
      landmark: "Near Central Park",
    },
    incident: {
      type: "medical",
      description: "Tourist collapsed, appears to be having difficulty breathing",
      photos: ["/placeholder-zk5vs.png"],
    },
    response: {
      assignedTo: "Unit Alpha-7",
      estimatedArrival: new Date("2024-01-15T14:45:00Z"),
      notes: ["Paramedics dispatched", "Tourist conscious but distressed"],
    },
  },
  {
    id: "SOS-002",
    timestamp: new Date("2024-01-15T13:15:00Z"),
    status: "in-progress",
    priority: "high",
    user: {
      name: "Marco Rodriguez",
      phone: "+34-600-123456",
      email: "marco.r@email.com",
      nationality: "Spain",
    },
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: "456 Market Street",
      landmark: "Times Square area",
    },
    incident: {
      type: "theft",
      description: "Wallet and passport stolen by pickpocket",
      photos: ["/crowded-tourist-area-theft-scene.jpg"],
    },
    response: {
      assignedTo: "Officer Martinez",
      notes: ["Report filed", "Checking nearby CCTV footage"],
    },
  },
  {
    id: "SOS-003",
    timestamp: new Date("2024-01-15T12:00:00Z"),
    status: "resolved",
    priority: "medium",
    user: {
      name: "Emma Thompson",
      phone: "+44-7700-900123",
      email: "emma.t@email.com",
      nationality: "UK",
    },
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: "789 Heritage Avenue",
      landmark: "Museum District",
    },
    incident: {
      type: "lost",
      description: "Lost in unfamiliar area, phone battery dead",
      photos: ["/confused-tourist-on-street.jpg"],
    },
    response: {
      assignedTo: "Tourist Guide Unit",
      notes: ["Tourist safely escorted to hotel", "Provided emergency contact info"],
    },
  },
  {
    id: "SOS-004",
    timestamp: new Date("2024-01-15T11:30:00Z"),
    status: "pending",
    priority: "high",
    user: {
      name: "Yuki Tanaka",
      phone: "+81-90-1234-5678",
      email: "yuki.t@email.com",
      nationality: "Japan",
    },
    location: {
      latitude: 40.7282,
      longitude: -74.0776,
      address: "321 Waterfront Drive",
      landmark: "Harbor View",
    },
    incident: {
      type: "accident",
      description: "Bicycle accident, minor injuries but unable to move bike",
      photos: ["/bicycle-accident-scene.jpg"],
    },
    response: {
      notes: ["Awaiting response unit assignment"],
    },
  },
  {
    id: "SOS-005",
    timestamp: new Date("2024-01-15T10:45:00Z"),
    status: "false-alarm",
    priority: "low",
    user: {
      name: "Pierre Dubois",
      phone: "+33-6-12-34-56-78",
      email: "pierre.d@email.com",
      nationality: "France",
    },
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: "654 Shopping District",
      landmark: "Fashion Avenue",
    },
    incident: {
      type: "other",
      description: "Accidentally pressed SOS button while taking photos",
      photos: [],
    },
    response: {
      notes: ["Confirmed false alarm via callback", "User apologized for mistake"],
    },
  },
]

// Statistics for dashboard overview
export const dashboardStats = {
  totalReports: mockSOSReports.length,
  activeReports: mockSOSReports.filter((r) => r.status === "pending" || r.status === "in-progress").length,
  resolvedToday: mockSOSReports.filter((r) => r.status === "resolved").length,
  criticalAlerts: mockSOSReports.filter((r) => r.priority === "critical").length,
  averageResponseTime: "8.5 minutes",
  responseRate: "94%",
}
