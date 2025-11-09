"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import MapSection from "@/components/map-section"
import FeatureShowcase from "@/components/feature-showcase"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import Dashboard from "@/components/dashboard"
import ReportBlight from "@/components/report-blight"
import UserProfile from "@/components/user-profile"
import VolunteerRegistration from "@/components/volunteer-registration"
import NotificationsCenter from "@/components/notifications-center"
import AdminPanel from "@/components/admin-panel"
import RewardsLeaderboard from "@/components/rewards-leaderboard"
import AchievementsShowcase from "@/components/achievements-showcase"
import Login from "@/components/login"
import SimpleAvatar from "@/components/simple-avatar"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")

  useEffect(() => {
    const stored = localStorage.getItem("blightwatch_user")
    if (stored) {
      setIsLoggedIn(true)
      setCurrentPage("dashboard")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SimpleAvatar />

      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {currentPage === "home" && (
        <>
          <Hero setCurrentPage={setCurrentPage} />
          <MapSection />
          <FeatureShowcase />
          <CTASection setCurrentPage={setCurrentPage} />
        </>
      )}

      {currentPage === "login" && <Login setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />}

      {currentPage === "register" && (
        <VolunteerRegistration setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />
      )}

      {currentPage === "dashboard" && <Dashboard setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />}

      {currentPage === "report" && <ReportBlight setCurrentPage={setCurrentPage} />}

      {currentPage === "profile" && <UserProfile setCurrentPage={setCurrentPage} />}

      {currentPage === "notifications" && <NotificationsCenter setCurrentPage={setCurrentPage} />}

      {currentPage === "admin" && <AdminPanel setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />}

      {currentPage === "leaderboard" && <RewardsLeaderboard setCurrentPage={setCurrentPage} />}

      {currentPage === "achievements" && <AchievementsShowcase setCurrentPage={setCurrentPage} />}

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  )
}
