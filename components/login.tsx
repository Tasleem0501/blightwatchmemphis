"use client"

import type React from "react"

import { useState } from "react"

export default function Login({ setCurrentPage, setIsLoggedIn }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Check if user exists in localStorage
      let foundUser = null
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("profile_")) {
          const user = JSON.parse(localStorage.getItem(key) || "{}")
          if (user.email === email) {
            foundUser = user
            break
          }
        }
      }

      if (foundUser) {
        localStorage.setItem("blightwatch_user", JSON.stringify(foundUser))
        setIsLoggedIn(true)
        setCurrentPage("dashboard")
      } else {
        setError("Email not found. Please register first.")
      }

      setIsLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">BlightWatch</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border-2 border-border rounded-lg p-8 space-y-6 shadow-sm">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setCurrentPage("register")}
              className="text-primary hover:opacity-80 font-semibold transition-opacity"
            >
              Create one
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-secondary/50 border border-secondary rounded-lg text-sm text-muted-foreground text-center">
          <p className="font-medium text-card-foreground mb-1">Demo Credentials</p>
          <p>Register first to test login functionality</p>
        </div>
      </div>
    </main>
  )
}
