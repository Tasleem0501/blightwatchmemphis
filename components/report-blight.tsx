"use client"

import type React from "react"

import { useState } from "react"

export default function ReportBlight({ setCurrentPage }: any) {
  const [formData, setFormData] = useState({
    type: "abandoned-building",
    severity: "medium",
    address: "",
    description: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const reports = JSON.parse(localStorage.getItem(`reports_${user.id}`) || "[]")

    const newReport = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    }

    reports.push(newReport)
    localStorage.setItem(`reports_${user.id}`, JSON.stringify(reports))

    const allNotifications = JSON.parse(localStorage.getItem("blightwatch_notifications") || "[]")
    const notification = {
      id: `notif_${Date.now()}`,
      type: "report",
      title: "Report Submitted Successfully",
      message: `Your ${formData.type.replace("-", " ")} report has been recorded and shared with the community.`,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      icon: "✓",
    }
    allNotifications.unshift(notification)
    localStorage.setItem("blightwatch_notifications", JSON.stringify(allNotifications))

    setSubmitted(true)
    setTimeout(() => {
      setCurrentPage("dashboard")
    }, 1500)
  }

  if (submitted) {
    return (
      <main className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-primary mb-2">Report Submitted!</h2>
          <p className="text-muted-foreground mb-4">Thank you for helping improve Memphis neighborhoods.</p>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-card border-2 border-border rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold text-card-foreground mb-2">Report Blight</h1>
        <p className="text-muted-foreground mb-8">
          Help us identify and track blight in Memphis neighborhoods. Your reports help keep our community safe and
          clean.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Blight Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="abandoned-building">Abandoned Building</option>
              <option value="graffiti">Graffiti</option>
              <option value="vacant-lot">Vacant Lot</option>
              <option value="litter">Litter/Debris</option>
              <option value="damaged-infrastructure">Damaged Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Severity Level *</label>
            <div className="flex gap-3">
              {[
                { value: "low", label: "Low", icon: "🟢" },
                { value: "medium", label: "Medium", icon: "🟡" },
                { value: "high", label: "High", icon: "🔴" },
              ].map((level) => (
                <label key={level.value} className="flex-1">
                  <input
                    type="radio"
                    name="severity"
                    value={level.value}
                    checked={formData.severity === level.value}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center font-medium ${
                      formData.severity === level.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-input text-foreground hover:border-primary"
                    }`}
                  >
                    <span className="text-xl block mb-1">{level.icon}</span>
                    {level.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, Memphis, TN"
              required
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about the blight you've observed..."
              required
              rows={5}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-bold shadow-md"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage("dashboard")}
              className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
