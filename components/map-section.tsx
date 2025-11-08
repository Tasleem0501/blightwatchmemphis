"use client"

import { useState, useEffect } from "react"
import BlightMap from "./blight-map"

export default function MapSection() {
  const [blightData, setBlightData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 })

  useEffect(() => {
    // Load all reports from localStorage for all users
    const allReports: any[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("reports_")) {
        const reports = JSON.parse(localStorage.getItem(key) || "[]")
        allReports.push(...reports)
      }
    }

    setBlightData(allReports)

    // Calculate stats
    const highSeverity = allReports.filter((r) => r.severity === "high").length
    const mediumSeverity = allReports.filter((r) => r.severity === "medium").length
    const lowSeverity = allReports.filter((r) => r.severity === "low").length

    setStats({
      total: allReports.length,
      high: highSeverity,
      medium: mediumSeverity,
      low: lowSeverity,
    })
  }, [])

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-foreground mb-2 text-center">Blight Index Map</h2>
      <p className="text-muted-foreground text-center mb-8">
        Real-time community blight tracking across Memphis neighborhoods
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">High Severity</p>
          <p className="text-2xl font-bold text-destructive">{stats.high}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Medium Severity</p>
          <p className="text-2xl font-bold" style={{ color: "hsl(35, 100%, 50%)" }}>
            {stats.medium}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Low Severity</p>
          <p className="text-2xl font-bold text-green-500">{stats.low}</p>
        </div>
      </div>

      {/* Map */}
      <BlightMap reports={blightData} />

      {/* Report List */}
      {blightData.length > 0 && (
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold text-card-foreground mb-4">Recent Reports</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {blightData
              .slice(-10)
              .reverse()
              .map((report, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-card-foreground capitalize">
                        {report.type?.replace("-", " ")}
                      </h4>
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
                    <p className="text-sm text-muted-foreground">{report.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {blightData.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No blight reports yet. Be the first to report!</p>
        </div>
      )}
    </section>
  )
}
