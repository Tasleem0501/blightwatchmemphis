"use client"

import { useEffect, useState } from "react"

interface VolunteerRank {
  rank: number
  name: string
  neighborhood: string
  totalReports: number
  points: number
  level: string
  achievements: number
}

export default function RewardsLeaderboard({ setCurrentPage }: any) {
  const [leaderboard, setLeaderboard] = useState<VolunteerRank[]>([])
  const [timeframe, setTimeframe] = useState<"all-time" | "month" | "week">("all-time")
  const [userRank, setUserRank] = useState<VolunteerRank | null>(null)

  useEffect(() => {
    loadLeaderboard()
  }, [timeframe])

  const loadLeaderboard = () => {
    const volunteers: any[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("profile_")) {
        const volunteer = JSON.parse(localStorage.getItem(key) || "{}")
        const reports = JSON.parse(localStorage.getItem(`reports_${volunteer.id}`) || "[]")

        let filteredReports = reports
        if (timeframe === "month") {
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          filteredReports = reports.filter((r: any) => {
            const reportDate = new Date(r.date)
            return reportDate >= oneMonthAgo
          })
        } else if (timeframe === "week") {
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          filteredReports = reports.filter((r: any) => {
            const reportDate = new Date(r.date)
            return reportDate >= oneWeekAgo
          })
        }

        const points = filteredReports.length * 50 + (volunteer.cleanupDays || 0) * 100
        const achievements = calculateAchievements(filteredReports.length, reports, volunteer)
        const level = getVolunteerLevel(filteredReports.length, volunteer.cleanupDays || 0)

        volunteers.push({
          id: volunteer.id,
          name: volunteer.name,
          neighborhood: volunteer.neighborhood,
          totalReports: filteredReports.length,
          points,
          level,
          achievements,
        })
      }
    }

    const sorted = volunteers.sort((a, b) => b.points - a.points)
    const ranked = sorted.map((v, idx) => ({
      rank: idx + 1,
      ...v,
    }))

    setLeaderboard(ranked)

    const currentUser = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const userRankData = ranked.find((r) => r.id === currentUser.id)
    if (userRankData) {
      setUserRank(userRankData)
    }
  }

  const calculateAchievements = (currentReports: number, allReports: any[], volunteer: any) => {
    let count = 0
    const cleanupDays = volunteer.cleanupDays || 0
    
    if (currentReports >= 1) count++
    if (currentReports >= 10) count++
    if (currentReports >= 25) count++
    if (allReports.filter((r) => r.severity === "high").length >= 5) count++
    
    if (cleanupDays >= 1) count++
    if (cleanupDays >= 3) count++
    if (cleanupDays >= 5) count++
    
    return count
  }

  const getVolunteerLevel = (reports: number, cleanupDays: number) => {
    const totalActivity = reports + cleanupDays * 2
    if (totalActivity < 1) return "Newcomer"
    if (totalActivity < 5) return "Active Volunteer"
    if (totalActivity < 10) return "Community Champion"
    if (totalActivity < 25) return "Civic Leader"
    return "Blight Warrior"
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return "⭐"
  }

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2">Community Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            Recognize our top volunteer contributors making a difference in Memphis
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { value: "all-time", label: "All Time" },
            { value: "month", label: "This Month" },
            { value: "week", label: "This Week" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeframe(t.value as any)}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                timeframe === t.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-card-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {userRank && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary rounded-lg p-8 mb-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Current Rank</p>
                <p className="text-4xl font-bold text-primary">#{userRank.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">{userRank.level}</p>
                <p className="text-4xl font-bold text-accent">{userRank.points} Points</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border-2 border-border rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b-2 border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Volunteer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Neighborhood</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Reports</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Achievements</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((volunteer, idx) => (
                  <tr
                    key={volunteer.rank}
                    className={`border-b border-border hover:bg-secondary/30 transition-colors ${idx < 3 ? "bg-secondary/50" : ""}`}
                  >
                    <td className="px-6 py-4 text-sm font-bold">
                      <span className="text-2xl mr-2">{getMedalIcon(volunteer.rank)}</span>#{volunteer.rank}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-card-foreground">{volunteer.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{volunteer.neighborhood}</td>
                    <td className="px-6 py-4 text-sm text-primary font-bold">{volunteer.totalReports}</td>
                    <td className="px-6 py-4 text-sm font-bold text-accent">{volunteer.points}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {volunteer.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold">
                        {volunteer.achievements} Badges
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage("dashboard")}
          className="mt-8 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  )
}