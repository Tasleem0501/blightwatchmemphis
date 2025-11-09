"use client"

import { useEffect, useRef, useState } from "react"

interface BlightReport {
  type: string
  severity: "low" | "medium" | "high"
  address: string
  description: string
  date?: string
}

export default function BlightMap({ reports }: { reports: BlightReport[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 })

  const memphisNeighborhoods = [
    { name: "Raleigh", x: 0.42, y: 0.28 },
    { name: "Downtown", x: 0.38, y: 0.38 },
    { name: "South Memphis", x: 0.35, y: 0.55 },
    { name: "Orange Mound", x: 0.48, y: 0.45 },
    { name: "Cooper-Young", x: 0.45, y: 0.32 },
    { name: "Frayser", x: 0.28, y: 0.22 },
    { name: "East Memphis", x: 0.62, y: 0.35 },
    { name: "Germantown", x: 0.68, y: 0.28 },
    { name: "Collierville", x: 0.72, y: 0.42 },
    { name: "West Memphis", x: 0.15, y: 0.42 },
    { name: "Cordova", x: 0.75, y: 0.25 },
  ]

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setDimensions({ width: Math.max(width, 600), height: 600 })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const width = canvas.width
    const height = canvas.height

    const img = new Image()
    img.src = "/memphis-map.png"
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)

      const heatMap: { [key: string]: number } = {}
      reports.forEach((report) => {
        const neighborhood = memphisNeighborhoods[Math.floor(Math.random() * memphisNeighborhoods.length)]
        const key = `${neighborhood.name}`
        heatMap[key] = (heatMap[key] || 0) + 1
      })

      memphisNeighborhoods.forEach((neighborhood) => {
        const count = heatMap[neighborhood.name] || 0
        if (count > 0) {
          const x = neighborhood.x * width
          const y = neighborhood.y * height

          let color = "#4ade80"
          if (count >= 5)
            color = "#ef4444"
          else if (count >= 2) color = "#f59e0b"

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

      ctx.fillStyle = "#333"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "top"
      ctx.fillText(`Total: ${reports.length}`, width - 10, 10)
    }
  }, [reports])

  return (
    <div ref={containerRef} className="border border-border rounded-lg overflow-hidden bg-white w-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto block"
        style={{ 
          display: 'block',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  )
}