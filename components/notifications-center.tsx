"use client"

import { useState, useEffect } from "react"

interface Notification {
  id: string
  type: "report" | "achievement" | "update" | "community"
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: string
  actionUrl?: string
}

export default function NotificationsCenter({ setCurrentPage }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<"all" | "report" | "achievement" | "update">("all")

  useEffect(() => {
    loadNotifications()
    // Simulate checking for new notifications
    const interval = setInterval(checkForNewNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const stored = localStorage.getItem(`notifications_${user.id}`)
    if (stored) {
      const notifs = JSON.parse(stored)
      setNotifications(notifs)
      setUnreadCount(notifs.filter((n: Notification) => !n.read).length)
    }
  }

  const checkForNewNotifications = () => {
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const reports = JSON.parse(localStorage.getItem(`reports_${user.id}`) || "[]")

    // Create notification for new community reports
    const lastCheck = localStorage.getItem(`last_notification_check_${user.id}`)
    const lastCheckTime = lastCheck ? new Date(lastCheck).getTime() : 0
    const now = new Date()

    if (reports.length > 0 && now.getTime() - lastCheckTime > 10000) {
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        type: "report",
        title: "New Community Report",
        message: `A new blight report was submitted in your neighborhood`,
        timestamp: now.toLocaleTimeString(),
        read: false,
        icon: "📍",
      }

      const existing = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || "[]")
      existing.push(newNotification)
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(existing))
      localStorage.setItem(`last_notification_check_${user.id}`, now.toISOString())
      loadNotifications()
    }
  }

  const markAsRead = (id: string) => {
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated))
    setUnreadCount(updated.filter((n) => !n.read).length)
  }

  const markAllAsRead = () => {
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated))
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    const user = JSON.parse(localStorage.getItem("blightwatch_user") || "{}")
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated))
    setUnreadCount(updated.filter((n) => !n.read).length)
  }

  const filteredNotifications = filter === "all" ? notifications : notifications.filter((n) => n.type === filter)

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-primary hover:opacity-80 font-semibold">
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "report", "achievement", "update"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-card-foreground hover:bg-secondary/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            filteredNotifications
              .slice()
              .reverse()
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    notification.read ? "border-border bg-card" : "border-primary bg-primary/5"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="text-2xl">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground">{notification.title}</h3>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-primary hover:opacity-80 font-semibold"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-muted-foreground hover:text-destructive font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </main>
  )
}
