"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface AdminStats {
  totalReports: number
  totalVolunteers: number
  highSeverityReports: number
  averageReportsPerVolunteer: number
  topNeighborhood: string
  mostActiveVolunteer: string
}

export default function AdminPanel({ setCurrentPage, setIsLoggedIn }: any) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [allReports, setAllReports] = useState<any[]>([])
  const [allVolunteers, setAllVolunteers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "volunteers">("overview")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Check if user is admin (stored in localStorage during registration)
    const adminFlag = localStorage.getItem("admin_authenticated")
    if (adminFlag) {
      setAuthenticated(true)
      loadAdminData()
    }
  }, [])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple admin password check (in production, this would be backend-protected)
    if (adminPassword === "blightwatch_admin_2025") {
      setAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      setAdminPassword("")
      loadAdminData()
    } else {
      alert("Invalid admin password")
    }
  }

  const loadAdminData = () => {
    const volunteers: any[] = []
    const reports: any[] = []
    const neighborhoodCount: { [key: string]: number } = {}

    // Collect all volunteers and their reports
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("profile_")) {
        const volunteer = JSON.parse(localStorage.getItem(key) || "{}")
        const volunteerReports = JSON.parse(localStorage.getItem(`reports_${volunteer.id}`) || "[]")

        volunteers.push({
          ...volunteer,
          reportCount: volunteerReports.length,
        })

        volunteerReports.forEach((report: any) => {
          reports.push({
            ...report,
            volunteerId: volunteer.id,
            volunteerName: volunteer.name,
          })
          neighborhoodCount[volunteer.neighborhood] = (neighborhoodCount[volunteer.neighborhood] || 0) + 1
        })
      }
    }

    setAllReports(reports)
    setAllVolunteers(volunteers)

    // Calculate statistics
    const highSeverity = reports.filter((r) => r.severity === "high").length
    const topNeighborhood = Object.entries(neighborhoodCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"
    const mostActive = volunteers.sort((a, b) => b.reportCount - a.reportCount)[0]

    setStats({
      totalReports: reports.length,
      totalVolunteers: volunteers.length,
      highSeverityReports: highSeverity,
      averageReportsPerVolunteer: volunteers.length > 0 ? ((reports.length / volunteers.length).toFixed(2) as any) : 0,
      topNeighborhood,
      mostActiveVolunteer: mostActive?.name || "N/A",
    })
  }

  const deleteReport = (reportId: number, volunteerId: string) => {
    const reports = JSON.parse(localStorage.getItem(`reports_${volunteerId}`) || "[]")
    const updated = reports.filter((r: any) => r.id !== reportId)
    localStorage.setItem(`reports_${volunteerId}`, JSON.stringify(updated))
    loadAdminData()
  }

  const markReportResolved = (reportId: number, volunteerId: string) => {
    const reports = JSON.parse(localStorage.getItem(`reports_${volunteerId}`) || "[]")
    const updated = reports.map((r: any) => (r.id === reportId ? { ...r, status: "resolved" } : r))
    localStorage.setItem(`reports_${volunteerId}`, JSON.stringify(updated))
    loadAdminData()
  }

  if (!authenticated) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">Admin Panel</h1>
            <p className="text-muted-foreground mb-8">Restricted access - Admin authentication required</p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">Admin Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Access Admin Panel
              </button>
            </form>

            <button
              onClick={() => setCurrentPage("home")}
              className="w-full mt-4 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
            >
              Back Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  const filteredReports = allReports.filter(
    (r) =>
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("admin_authenticated")
              setAuthenticated(false)
              setCurrentPage("home")
            }}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Logout Admin
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {["overview", "reports", "volunteers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Reports</p>
              <p className="text-4xl font-bold text-primary">{stats.totalReports}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Volunteers</p>
              <p className="text-4xl font-bold text-primary">{stats.totalVolunteers}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">High Severity Reports</p>
              <p className="text-4xl font-bold text-destructive">{stats.highSeverityReports}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Avg Reports/Volunteer</p>
              <p className="text-4xl font-bold" style={{ color: "hsl(35, 100%, 50%)" }}>
                {stats.averageReportsPerVolunteer}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Top Neighborhood</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.topNeighborhood}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Most Active Volunteer</p>
              <p className="text-xl font-bold text-card-foreground">{stats.mostActiveVolunteer}</p>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by address or type..."
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Address</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Severity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Volunteer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                          No reports found
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                          <td className="px-6 py-4 text-sm text-card-foreground">{report.address}</td>
                          <td className="px-6 py-4 text-sm text-card-foreground capitalize">
                            {report.type?.replace("-", " ")}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                report.severity === "high"
                                  ? "bg-destructive text-destructive-foreground"
                                  : report.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {report.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-card-foreground">{report.volunteerName}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{report.date}</td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => markReportResolved(report.id, report.volunteerId)}
                              className="text-primary hover:opacity-80 font-semibold"
                            >
                              Mark Resolved
                            </button>
                            <button
                              onClick={() => deleteReport(report.id, report.volunteerId)}
                              className="text-destructive hover:opacity-80 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === "volunteers" && (
          <div className="grid gap-6">
            {allVolunteers.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">No volunteers registered yet</p>
              </div>
            ) : (
              allVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-semibold text-card-foreground">{volunteer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="text-sm text-card-foreground">{volunteer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Neighborhood</p>
                      <p className="font-semibold text-card-foreground">{volunteer.neighborhood}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reports Submitted</p>
                      <p className="text-2xl font-bold text-primary">{volunteer.reportCount}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {volunteer.interests?.map((interest: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-secondary text-card-foreground rounded-full text-xs font-semibold"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
