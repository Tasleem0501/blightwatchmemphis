"use client"

export default function CTASection({ setCurrentPage }: any) {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-900 text-primary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">Ready to Make a Difference?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-pretty opacity-95 leading-relaxed">
          Every report helps improve our neighborhoods. Join BlightWatch today and become part of the solution that's
          transforming Memphis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("register")}
            className="px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-bold text-lg shadow-lg"
          >
            Join BlightWatch Memphis
          </button>
          <button
            onClick={() => setCurrentPage("login")}
            className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors font-bold text-lg shadow-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  )
}
