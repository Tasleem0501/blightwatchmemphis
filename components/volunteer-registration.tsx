"use client"

import type React from "react"

import { useState } from "react"

export default function VolunteerRegistration({ setCurrentPage, setIsLoggedIn }: any) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    neighborhood: "",
    phone: "",
    interests: [] as string[],
  })
  const [error, setError] = useState("")

  const neighborhoods = [
    "Midtown",
    "Downtown",
    "South Memphis",
    "Orange Mound",
    "Cooper-Young",
    "Germantown",
    "East Memphis",
    "Raleigh",
  ]

  const interests = ["Reporting Blight", "Cleanup Events", "Community Organizing", "Photography", "Data Analysis"]

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.neighborhood) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.interests.length === 0) {
      setError("Please select at least one area of interest")
      return
    }

    const userId = `user_${Date.now()}`
    const userData = {
      id: userId,
      ...formData,
      joinDate: new Date().toLocaleDateString(),
      totalReports: 0,
      totalPoints: 0,
      level: "Newcomer",
    }

    localStorage.setItem("blightwatch_user", JSON.stringify(userData))
    localStorage.setItem(`profile_${userId}`, JSON.stringify(userData))

    setIsLoggedIn(true)
    setCurrentPage("dashboard")
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Join BlightWatch</h1>
          <p className="text-muted-foreground">Step {step} of 3 - Let's get you started</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Step 2: Neighborhood */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-4">
                  Which neighborhood are you in? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {neighborhoods.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, neighborhood: n })}
                      className={`p-3 rounded-lg border-2 transition-colors font-semibold text-sm ${
                        formData.neighborhood === n
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-input text-foreground hover:border-primary"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-4">
                  What interests you? (Select at least one) *
                </label>
                <div className="space-y-3">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors font-semibold text-left ${
                        formData.interests.includes(interest)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-input text-foreground hover:border-primary"
                      }`}
                    >
                      <span className="mr-2">{formData.interests.includes(interest) ? "✓" : "○"}</span>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-6 border-t border-border">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Create Account
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already a member?{" "}
          <button onClick={() => setCurrentPage("login")} className="text-primary hover:opacity-80 font-semibold">
            Sign in
          </button>
        </p>
      </div>
    </main>
  )
}
