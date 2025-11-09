"use client"

import { useEffect, useState } from "react"

export default function Dashboard({ setCurrentPage, setIsLoggedIn }: any) {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("blightwatch_user")
    if (stored) {
      const userData = JSON.parse(stored)
      setUser(userData)
      // Load user's reports
      const storedReports = localStorage.getItem(`reports_${userData.id}`)
      if (storedReports) {
        setReports(JSON.parse(storedReports))
      }
    }
  }, [])

  if (!user) return null

  const points = reports.length * 50
  const level = reports.length < 5 ? "Newcomer" : reports.length < 10 ? "Active Volunteer" : "Community Champion"

  return (
    <main className="container mx-auto px-4 py-12">
      <button
        onClick={() => setCurrentPage("home")}
        className="mb-6 text-primary hover:opacity-80 font-semibold flex items-center gap-2"
      >
        ← Back to Home
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-24">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Welcome, {user.name}</p>
              <p className="text-sm text-muted-foreground mb-4">{user.neighborhood}</p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">Your Level</p>
              <p className="text-xl font-bold text-primary mb-4">{level}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Reports Submitted</p>
              <p className="text-3xl font-bold text-primary">{reports.length}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Rewards Points</p>
              <p className="text-3xl font-bold" style={{ color: "hsl(35, 100%, 50%)" }}>
                {points}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Community Impact</p>
              <p className="text-lg font-semibold text-foreground">
                {reports.length > 0 ? "Active" : "Getting Started"}
              </p>
            </div>

            <button
              onClick={() => setCurrentPage("leaderboard")}
              className="w-full mt-4 px-4 py-2 bg-secondary text-card-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
            >
              View Leaderboard
            </button>

            <button
              onClick={() => setCurrentPage("achievements")}
              className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
            >
              View Achievements
            </button>

            <button
              onClick={() => setCurrentPage("profile")}
              className="w-full px-4 py-2 bg-secondary text-card-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
            >
              View Full Profile
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Your Reports</h2>
              <button
                onClick={() => setCurrentPage("report")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
              >
                + New Report
              </button>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No reports yet. Help improve Memphis by submitting a blight report!
                </p>
                <button
                  onClick={() => setCurrentPage("report")}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Submit Your First Report
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports
                  .slice()
                  .reverse()
                  .map((report, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-card-foreground capitalize">
                          {report.type?.replace("-", " ")}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            report.severity === "high"
                              ? "bg-destructive text-destructive-foreground"
                              : report.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {report.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.address}</p>
                      <p className="text-sm text-foreground line-clamp-2">{report.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{report.date}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("blightwatch_user")
          setIsLoggedIn(false)
          setCurrentPage("home")
        }}
        className="mt-8 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
      >
        Logout
      </button>
    </main>
  )
}
