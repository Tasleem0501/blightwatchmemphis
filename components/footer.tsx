"use client"

export default function Footer({ setCurrentPage }: any) {
  return (
    <footer className="border-t-2 border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏙️</span>
              <h4 className="font-bold text-card-foreground text-lg">BlightWatch</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Community-driven blight reporting empowering Memphis residents to create cleaner, safer neighborhoods.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-card-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="hover:text-primary transition-colors font-medium"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("leaderboard")}
                  className="hover:text-primary transition-colors font-medium"
                >
                  Leaderboard
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-card-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors font-medium">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors font-medium">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors font-medium">
                  Report Bug
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-card-foreground mb-4">Administration</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => setCurrentPage("admin")}
                  className="hover:text-primary transition-colors font-medium"
                >
                  Admin Portal
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors font-medium">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors font-medium">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 BlightWatch Memphis. All rights reserved.</p>
            <p className="text-center md:text-right">Empowering communities through civic engagement</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
