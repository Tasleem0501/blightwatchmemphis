"use client"

import NotificationBell from "./notification-bell"

export default function Header({ isLoggedIn, setIsLoggedIn, currentPage, setCurrentPage }: any) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => {
            setCurrentPage("home")
            window.scrollTo(0, 0)
          }}
          className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <span className="text-2xl">🏙️</span>
          BlightWatch
        </button>

        <nav className="flex items-center gap-6">
          {isLoggedIn && (
            <>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={`text-sm font-semibold transition-colors ${currentPage === "dashboard" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage("report")}
                className={`text-sm font-semibold transition-colors ${currentPage === "report" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Report
              </button>
              <button
                onClick={() => setCurrentPage("leaderboard")}
                className={`text-sm font-semibold transition-colors ${currentPage === "leaderboard" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Leaderboard
              </button>
              <NotificationBell setCurrentPage={setCurrentPage} />
              <div className="w-px h-6 bg-border" />
              <button
                onClick={() => setCurrentPage("profile")}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("blightwatch_user")
                  setIsLoggedIn(false)
                  setCurrentPage("home")
                }}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <button
                onClick={() => setCurrentPage("home")}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("login")}
                className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage("register")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
              >
                Join Now
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
