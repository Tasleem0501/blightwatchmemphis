"use client"

import { useEffect, useState } from "react"

export default function NotificationCenter({ setCurrentPage }: any) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [blightAlert, setBlightAlert] = useState(false)

  useEffect(() => {
    loadNotifications()
    // Check for high blight areas
    checkBlightAlert()
    const interval = setInterval(checkBlightAlert, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkBlightAlert = () => {
    const allReports = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("reports_")) {
        const reports = JSON.parse(localStorage.getItem(key) || "[]")
        allReports.push(...reports)
      }
    }

    // Count high severity reports in past 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    const recentHighReports = allReports.filter((r: any) => {
      const reportDate = new Date(r.date)
      return reportDate >= oneDayAgo && r.severity === "high"
    })

    setBlightAlert(recentHighReports.length >= 3)
  }

  const loadNotifications = () => {
    const stored = localStorage.getItem("blightwatch_notifications") || "[]"
    setNotifications(JSON.parse(stored).slice(0, 20))
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    localStorage.setItem("blightwatch_notifications", JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem("blightwatch_notifications", JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem("blightwatch_notifications", JSON.stringify(updated))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <main className="container mx-auto px-4 py-12">
      {blightAlert && (
        <div className="mb-8 p-6 bg-destructive/10 border-2 border-destructive rounded-lg flex items-start gap-4">
          <div className="text-3xl">🚨</div>
          <div className="flex-1">
            <h3 className="font-bold text-destructive text-lg mb-1">High Blight Alert</h3>
            <p className="text-destructive/80">
              Multiple high-severity blight reports have been submitted in Memphis neighborhoods in the past 24 hours.
              Please review and prioritize cleanup efforts.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-muted-foreground mb-4">No notifications yet</p>
            <button onClick={() => setCurrentPage("report")} className="text-primary hover:opacity-80 font-semibold">
              Submit a report to get started
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-card border-2 rounded-lg p-4 transition-all ${
                  notification.read ? "border-border opacity-75" : "border-primary bg-primary/5"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{notification.icon || "📢"}</span>
                      <h3 className={`font-semibold ${notification.read ? "text-muted-foreground" : "text-primary"}`}>
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity font-semibold"
                      >
                        Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded hover:opacity-90 transition-opacity font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setCurrentPage("dashboard")}
          className="mt-8 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-opacity font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  )
}
