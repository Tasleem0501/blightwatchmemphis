"use client"

import { useEffect, useState } from "react"

export default function UserProfile({ setCurrentPage }: any) {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("blightwatch_user")
    if (stored) {
      const userData = JSON.parse(stored)
      setUser(userData)

      // Load user's reports
      const storedReports = JSON.parse(localStorage.getItem(`reports_${userData.id}`) || "[]")
      setReports(storedReports)

      // Calculate achievements
      const achievementsList = []
      if (storedReports.length >= 1)
        achievementsList.push({ id: 1, name: "First Report", icon: "🌟", desc: "Submitted your first report" })
      if (storedReports.length >= 5)
        achievementsList.push({ id: 2, name: "Community Watch", icon: "👁️", desc: "5+ reports submitted" })
      if (storedReports.length >= 10)
        achievementsList.push({ id: 3, name: "Civic Hero", icon: "🏆", desc: "10+ reports submitted" })

      const highSeverity = storedReports.filter((r) => r.severity === "high").length
      if (highSeverity >= 3)
        achievementsList.push({ id: 4, name: "Critical Observer", icon: "⚠️", desc: "3+ high-severity reports" })

      setAchievements(achievementsList)
    }
  }, [])

  if (!user) return null

  const points = reports.length * 50
  const level = reports.length < 5 ? "Newcomer" : reports.length < 10 ? "Active Volunteer" : "Community Champion"

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className="mb-6 text-primary hover:opacity-80 font-semibold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">{level}</div>
                <div className="px-3 py-1 bg-secondary text-card-foreground rounded-full text-sm font-semibold">
                  {user.neighborhood}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Points</p>
              <p className="text-4xl font-bold" style={{ color: "hsl(35, 100%, 50%)" }}>
                {points}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Member since {user.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Reports Submitted</p>
            <p className="text-4xl font-bold text-primary">{reports.length}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Average Severity</p>
            <p className="text-4xl font-bold">
              {reports.length === 0
                ? "-"
                : reports.filter((r) => r.severity === "high").length > reports.length / 2
                  ? "High"
                  : reports.filter((r) => r.severity === "medium").length > reports.length / 2
                    ? "Med"
                    : "Low"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Community Impact</p>
            <p className="text-4xl font-bold text-green-500">{reports.length > 0 ? "Active" : "-"}</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Achievements</h2>
          {achievements.length === 0 ? (
            <p className="text-muted-foreground">No achievements yet. Keep submitting reports to earn badges!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="border border-border rounded-lg p-4 flex items-start gap-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold text-card-foreground">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interests */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Areas of Interest</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-secondary text-card-foreground rounded-full text-sm font-semibold"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">Recent Reports</h2>
            <div className="space-y-3">
              {reports
                .slice(-5)
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
                    <p className="text-sm text-muted-foreground mb-1">{report.address}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
