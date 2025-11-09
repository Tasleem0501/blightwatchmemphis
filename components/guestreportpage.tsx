"use client"

import { useState } from "react"
import BlightMap from "./blight-map

interface BlightReport {
  type: string
  severity: "low" | "medium" | "high"
  address: string
  description: string
  date?: string
}

export default function GuestReportPage({ setCurrentPage, setIsLoggedIn }: any) {
  const [reports, setReports] = useState<BlightReport[]>([])
  const [formData, setFormData] = useState({
    type: "",
    severity: "medium",
    address: "",
    description: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [showCleanupForm, setShowCleanupForm] = useState(false)
  const [cleanupData, setCleanupData] = useState({
    name: "",
    email: "",
    phone: "",
    cleanupDate: "",
    location: "",
  })

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.type || !formData.address || !formData.description) {
      alert("Please fill in all fields")
      return
    }

    const newReport: BlightReport = {
      ...formData,
      date: new Date().toLocaleDateString(),
    }

    setReports([...reports, newReport])
    setSuccessMessage("Report submitted successfully! Thank you for helping clean Memphis.")

    setFormData({
      type: "",
      severity: "medium",
      address: "",
      description: "",
    })

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleCleanupSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!cleanupData.name || !cleanupData.email || !cleanupData.cleanupDate || !cleanupData.location) {
      alert("Please fill in all fields")
      return
    }

    alert(`Thank you! You're registered for cleanup on ${cleanupData.cleanupDate} in ${cleanupData.location}. Check your email for details.`)

    setCleanupData({
      name: "",
      email: "",
      phone: "",
      cleanupDate: "",
      location: "",
    })
    setShowCleanupForm(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">BlightWatch</h1>
            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">
              Guest Mode
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("blightwatch_user")
              setIsLoggedIn(false)
              setCurrentPage("login")
            }}
            className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {successMessage && (
              <div className="p-4 bg-green-500/10 border border-green-500 text-green-700 rounded-lg font-medium">
                ✓ {successMessage}
              </div>
            )}

            <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Report Blight</h2>
              <p className="text-muted-foreground mb-6">
                Help us identify blight issues in Memphis. No account needed - just submit your report below.
              </p>

              <form onSubmit={handleReportSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Type of Issue *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select an issue type</option>
                    <option value="abandoned_building">Abandoned Building</option>
                    <option value="vacant_lot">Vacant Lot</option>
                    <option value="graffiti">Graffiti</option>
                    <option value="illegal_dumping">Illegal Dumping</option>
                    <option value="overgrown_property">Overgrown Property</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Severity Level
                  </label>
                  <div className="flex gap-4">
                    {["low", "medium", "high"].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="severity"
                          value={level}
                          checked={formData.severity === level}
                          onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                          className="w-4 h-4"
                        />
                        <span className="capitalize font-medium text-foreground">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Address or Location *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address or neighborhood"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the issue in detail..."
                    rows={5}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Submit Report
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Cleanup Day Registration</h2>
              <p className="text-muted-foreground mb-6">
                Want to help clean up? Register for our next community cleanup day.
              </p>

              {!showCleanupForm ? (
                <button
                  onClick={() => setShowCleanupForm(true)}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Register for Cleanup
                </button>
              ) : (
                <form onSubmit={handleCleanupSubmit} className="space-y-6">
                  <div>
  <label className="block text-sm font-semibold text-card-foreground mb-2">
    Full Name (Optional)
  </label>
  <input
    type="text"
    value={cleanupData.name}
    onChange={(e) => setCleanupData({ ...cleanupData, name: e.target.value })}
    placeholder="Your name"
    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
  />
</div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={cleanupData.email}
                      onChange={(e) => setCleanupData({ ...cleanupData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={cleanupData.phone}
                      onChange={(e) => setCleanupData({ ...cleanupData, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Preferred Cleanup Date *
                    </label>
                    <input
                      type="date"
                      value={cleanupData.cleanupDate}
                      onChange={(e) => setCleanupData({ ...cleanupData, cleanupDate: e.target.value })}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Preferred Location *
                    </label>
                    <input
                      type="text"
                      value={cleanupData.location}
                      onChange={(e) => setCleanupData({ ...cleanupData, location: e.target.value })}
                      placeholder="Neighborhood or area"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCleanupForm(false)}
                      className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold border border-border"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-lg font-bold text-foreground mb-4">Reports Submitted</h3>
              <BlightMap reports={reports} />
              <div className="mt-4 p-4 bg-secondary/50 border border-secondary rounded-lg">
                <p className="text-sm font-semibold text-card-foreground">
                  Total Reports: {reports.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {reports.length === 0
                    ? "Submit your first report to see it on the map"
                    : "Thank you for helping!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}