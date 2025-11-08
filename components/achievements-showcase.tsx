"use client"

import { useEffect, useState } from "react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  unlocked: boolean
}

export default function AchievementsShowcase({ setCurrentPage }: any) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedCount, setUnlockedCount] = useState(0)
  const [userStats, setUserStats] = useState({ totalReports: 0, highSeverity: 0 })

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = () => {
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const reports = JSON.parse(localStorage.getItem(`reports_${user.id}`) || "[]")

    const totalReports = reports.length
    const highSeverity = reports.filter((r: any) => r.severity === "high").length

    setUserStats({ totalReports, highSeverity })

    const allAchievements: Achievement[] = [
      {
        id: "first-report",
        name: "First Step",
        description: "Submit your first blight report",
        icon: "🌱",
        requirement: "1 report",
        unlocked: totalReports >= 1,
      },
      {
        id: "active-volunteer",
        name: "Active Volunteer",
        description: "Submit 5 blight reports",
        icon: "👁️",
        requirement: "5 reports",
        unlocked: totalReports >= 5,
      },
      {
        id: "community-champion",
        name: "Community Champion",
        description: "Submit 10 blight reports",
        icon: "🏆",
        requirement: "10 reports",
        unlocked: totalReports >= 10,
      },
      {
        id: "civic-leader",
        name: "Civic Leader",
        description: "Submit 25 blight reports",
        icon: "🌟",
        requirement: "25 reports",
        unlocked: totalReports >= 25,
      },
      {
        id: "critical-observer",
        name: "Critical Observer",
        description: "Report 3 high-severity issues",
        icon: "⚠️",
        requirement: "3 high-severity",
        unlocked: highSeverity >= 3,
      },
      {
        id: "accuracy-champion",
        name: "Accuracy Champion",
        description: "Report 10 high-severity issues",
        icon: "🎯",
        requirement: "10 high-severity",
        unlocked: highSeverity >= 10,
      },
      {
        id: "speedster",
        name: "Speedster",
        description: "Submit 3 reports in one day",
        icon: "⚡",
        requirement: "3 reports/day",
        unlocked: checkDailyStreak(reports, 3),
      },
      {
        id: "dedicated-volunteer",
        name: "Dedicated Volunteer",
        description: "Report consistently for 7 days",
        icon: "📅",
        requirement: "7-day streak",
        unlocked: checkDailyStreak(reports, 7),
      },
    ]

    setAchievements(allAchievements)
    setUnlockedCount(allAchievements.filter((a) => a.unlocked).length)
  }

  const checkDailyStreak = (reports: any[], days: number) => {
    if (reports.length < days) return false

    const dates = reports.map((r) => new Date(r.date).toDateString()).filter((v, i, a) => a.indexOf(v) === i)
    return dates.length >= days
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Achievements</h1>
        <p className="text-muted-foreground mb-8">
          Unlock badges and earn recognition for your community contributions
        </p>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Achievements</p>
            <p className="text-4xl font-bold text-primary">{unlockedCount}/8</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Progress</p>
            <div className="w-full bg-secondary rounded-full h-3 mt-2">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${(unlockedCount / 8) * 100}%` }}
              />
            </div>
            <p className="text-sm font-semibold text-card-foreground mt-2">{Math.round((unlockedCount / 8) * 100)}%</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-4">Your Stats</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-card-foreground">Total Reports:</span>
                <span className="font-bold text-primary">{userStats.totalReports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-card-foreground">High Severity:</span>
                <span className="font-bold text-destructive">{userStats.highSeverity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-lg p-6 border-2 transition-all ${
                achievement.unlocked ? "bg-primary/10 border-primary" : "bg-secondary/50 border-border opacity-60"
              }`}
            >
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h3 className="font-bold text-card-foreground mb-1">{achievement.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{achievement.requirement}</span>
                {achievement.unlocked && <span className="text-xs font-bold text-primary">✓ Unlocked</span>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage("profile")}
          className="mt-12 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
        >
          Back to Profile
        </button>
      </div>
    </main>
  )
}
