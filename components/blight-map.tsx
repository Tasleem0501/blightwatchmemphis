"use client"

import { useEffect, useRef } from "react"

interface BlightReport {
  type: string
  severity: "low" | "medium" | "high"
  address: string
  description: string
  date?: string
}

export default function BlightMap({ reports }: { reports: BlightReport[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sample Memphis neighborhoods with coordinates (simplified)
  const memphisNeighborhoods = [
    { name: "Midtown", x: 0.45, y: 0.35 },
    { name: "Downtown", x: 0.5, y: 0.55 },
    { name: "South Memphis", x: 0.4, y: 0.7 },
    { name: "Orange Mound", x: 0.55, y: 0.6 },
    { name: "Cooper-Young", x: 0.52, y: 0.4 },
    { name: "Germantown", x: 0.3, y: 0.3 },
    { name: "East Memphis", x: 0.65, y: 0.45 },
    { name: "Raleigh", x: 0.2, y: 0.6 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i
      const y = (height / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw neighborhoods
    ctx.fillStyle = "#f0f0f0"
    ctx.strokeStyle = "#999"
    ctx.lineWidth = 2
    memphisNeighborhoods.forEach((neighborhood) => {
      const x = neighborhood.x * width
      const y = neighborhood.y * height
      ctx.fillRect(x - 40, y - 30, 80, 60)
      ctx.strokeRect(x - 40, y - 30, 80, 60)
      ctx.fillStyle = "#666"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(neighborhood.name, x, y)
      ctx.fillStyle = "#f0f0f0"
    })

    // Draw blight reports as heat map points
    const heatMap: { [key: string]: number } = {}
    reports.forEach((report) => {
      const neighborhood = memphisNeighborhoods[Math.floor(Math.random() * memphisNeighborhoods.length)]
      const key = `${neighborhood.name}`
      heatMap[key] = (heatMap[key] || 0) + 1
    })

    // Draw clusters
    memphisNeighborhoods.forEach((neighborhood) => {
      const count = heatMap[neighborhood.name] || 0
      if (count > 0) {
        const x = neighborhood.x * width
        const y = neighborhood.y * height

        // Color intensity based on count
        let color = "#4ade80" // green for low
        if (count >= 5)
          color = "#ef4444" // red for high
        else if (count >= 2) color = "#f59e0b" // orange for medium

        ctx.fillStyle = color
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.arc(x, y, 20 + count * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.fillStyle = color
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(count.toString(), x, y)
      }
    })

    // Draw legend
    const legendX = 10
    const legendY = 10
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.fillRect(legendX, legendY, 140, 100)
    ctx.strokeRect(legendX, legendY, 140, 100)

    ctx.fillStyle = "#333"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText("Severity Legend", legendX + 8, legendY + 8)

    const items = [
      { color: "#4ade80", label: "Low (1 report)" },
      { color: "#f59e0b", label: "Medium (2-4)" },
      { color: "#ef4444", label: "High (5+)" },
    ]

    items.forEach((item, idx) => {
      const yOffset = legendY + 28 + idx * 20
      ctx.fillStyle = item.color
      ctx.fillRect(legendX + 8, yOffset, 12, 12)
      ctx.fillStyle = "#333"
      ctx.font = "11px sans-serif"
      ctx.fillText(item.label, legendX + 25, yOffset)
    })

    // Draw total count
    ctx.fillStyle = "#333"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "top"
    ctx.fillText(`Total: ${reports.length}`, width - 10, 10)
  }, [reports])

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-white">
      <canvas ref={canvasRef} width={800} height={500} className="w-full border-0" />
    </div>
  )
}
