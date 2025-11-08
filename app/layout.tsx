import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BlightWatch Memphis - Community Blight Reporting",
  description:
    "Join BlightWatch Memphis to report and track urban blight in Memphis neighborhoods. Help improve your community by identifying and reporting blight hotspots. Earn rewards and become a Civic Leader.",
  generator: "",
  openGraph: {
    title: "BlightWatch Memphis - Community Blight Reporting",
    description: "Join volunteers tracking and reporting urban blight across Memphis neighborhoods.",
    url: "https://blightwatch.app",
    siteName: "BlightWatch Memphis",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/apple-icon.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/apple-icon.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/apple-icon.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
