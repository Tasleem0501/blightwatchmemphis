"use client"

import { useState, useEffect } from "react"

export default function SimpleAvatar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "avatar", text: "Hi! Welcome to BlightWatch Memphis 🎸" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      const avatarMessage = {
        role: "avatar",
        text: data.response || "Sorry, I didn't understand that. Try asking about reporting blight or earning rewards!",
      }
      setMessages((prev) => [...prev, avatarMessage])
    } catch (error) {
      console.error("[v0] Message error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "avatar",
          text: "Oops! Something went wrong. Try again!",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isVisible && (
        <div className={isChatOpen ? "" : "animate-bounce"}>
          {isChatOpen ? (
            <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border-2 border-memphis-blue">
              {/* Chat header */}
              <div className="bg-memphis-blue text-black p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎸</span>
                  <span className="font-semibold">Memphis Guide</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-xl hover:opacity-80 transition">
                  ✕
                </button>
              </div>

              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.role === "user" ? "bg-memphis-blue text-black" : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 px-3 py-2 rounded-lg">
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="border-t border-gray-200 p-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-memphis-blue"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-memphis-blue text-black px-3 py-2 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-3">
              <div className="bg-memphis-blue text-black rounded-lg px-4 py-3 shadow-lg max-w-xs">
                <p className="text-sm font-medium">Hi! Welcome to BlightWatch Memphis 🎸</p>
                <p className="text-xs opacity-90 mt-1">
                  Help us keep our neighborhoods clean by reporting blight and joining our volunteer community!
                </p>
                <div className="absolute right-0 top-full -mr-2 border-l-8 border-t-8 border-l-transparent border-t-memphis-blue"></div>
              </div>

              <button
                onClick={() => setIsChatOpen(true)}
                className="w-16 h-16 bg-gradient-to-br from-memphis-blue to-memphis-light rounded-full shadow-xl flex items-center justify-center text-4xl cursor-pointer hover:scale-110 transition-transform"
              >
                🎸
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
