"use client"

export default function Hero({ setCurrentPage }: any) {
  return (
    <section className="relative bg-gradient-to-br from-primary via-blue-900 to-accent/20 py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg+xmlns=%22http://www.w3.org/2000/svg%22+viewBox=%220+0+1200+400%22%3E%3Cdefs%3E%3ClinearGradient+id=%22g%22+x1=%220%25%22+y1=%220%25%22+x2=%22100%25%22+y2=%22100%25%22%3E%3Cstop+offset=%220%25%22+style=%22stop-color:white;stop-opacity:0.5%22/%3E%3Cstop+offset=%22100%25%22+style=%22stop-color:white;stop-opacity:0.1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect+width=%221200%22+height=%22400%22+fill=%22url(%23g)%22/%3E%3Cpath+d=%22M+0+250+L+150+200+L+300+240+L+450+180+L+600+220+L+750+160+L+900+210+L+1050+170+L+1200+200+L+1200+400+L+0+400%22+fill=%22white%22+opacity=%220.05%22/%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 text-balance leading-tight drop-shadow-lg">
          Take Action Against Blight in Memphis
        </h1>
        <p className="text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto text-pretty leading-relaxed drop-shadow">
          Join thousands of volunteers and community members tracking and reporting urban blight. Together, we're
          creating a cleaner, safer, and stronger Memphis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("register")}
            className="px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-bold text-lg shadow-lg"
          >
            Get Started Today
          </button>
          <button
  onClick={() => window.open("https://311.memphistn.gov/portal/apps/dashboards/36ec917084f64ccbbd527c623531845e", "_blank")}
  className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors font-bold text-lg shadow-lg"
>
  View Community Reports
</button>
        </div>
      </div>
    </section>
  )
}
