"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { ChevronDown, Send, Minimize2, Maximize2 } from "lucide-react"

export default function AIAvatar({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { messages, input, setInput, append, status } = useChat({
    api: "/api/avatar-chat",
  })

  const handleSendMessage = () => {
    if (input.trim()) {
      append({ role: "user", content: input })
      setInput("")
    }
  }

  const suggestedActions = [
    {
      label: "Report Blight",
      action: () => {
        setCurrentPage("report")
        setIsOpen(false)
      },
    },
    {
      label: "See Rewards",
      action: () => {
        setCurrentPage("leaderboard")
        setIsOpen(false)
      },
    },
    {
      label: "Join Us",
      action: () => {
        setCurrentPage("register")
        setIsOpen(false)
      },
    },
  ]

  return (
    <>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isOpen ? "scale-0" : "scale-100"}`}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-memphis-blue to-memphis-accent flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-transform">
            <span className="text-3xl">🎸</span>
          </div>
          <ChevronDown className="absolute -bottom-1 -right-1 w-5 h-5 bg-memphis-accent text-black rounded-full" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border-2 border-memphis-blue/20 transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-screen sm:h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-memphis-blue to-memphis-accent text-black p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎵</span>
              <div>
                <h3 className="font-bold text-lg">Memphis</h3>
                <p className="text-xs opacity-90">Your BlightWatch Guide</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1 rounded">
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded text-lg">
                ×
              </button>
            </div>
          </div>

          {/* Chat Area */}
          {!isMinimized && (
            <>
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && <span className="text-lg flex-shrink-0">🎸</span>}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-memphis-blue text-black rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === "user" && <span className="text-lg flex-shrink-0">👤</span>}
                  </div>
                ))}
                {status === "in_progress" && (
                  <div className="flex gap-2">
                    <span className="text-lg">🎸</span>
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Actions */}
              {messages.length <= 1 && (
                <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                  <p className="text-xs text-gray-600 font-semibold uppercase">Quick Actions:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={action.action}
                        className="text-sm px-3 py-2 bg-memphis-blue/10 text-memphis-blue hover:bg-memphis-blue/20 rounded font-semibold transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask Memphis..."
                    className="flex-1 px-3 py-2 border border-memphis-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-memphis-blue/50 text-sm"
                    disabled={status === "in_progress"}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={status === "in_progress" || !input.trim()}
                    className="bg-memphis-blue text-black p-2 rounded-lg hover:bg-memphis-blue/90 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
