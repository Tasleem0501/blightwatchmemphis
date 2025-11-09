"use client"

export default function FeatureShowcase() {
  const features = [
    {
      icon: "📋",
      title: "Reporting to City",
      link: "https://311.memphistn.gov/public",
      description: "Submit blight reports in seconds with photos, descriptions, and location data.",
      color: "from-primary/10 to-transparent",
    },
    {
  icon: "🗺️",
  title: "Community Map",
  description: "See reported blight locations and contribute to a citywide blight index.",
  color: "from-accent/10 to-transparent",
  onClick: () => window.open("https://felt.com/map/Blight-Watch-Z9A9AbN6SOTIa6Xdwym5g9C7A?share=1&loc=35.11477,-89.97298,14.23z", "_blank"),
  embed: true,
  embedSrc: "https://felt.com/embed/map/Blight-Watch-Z9A9AbN6SOTIa6Xdwym5g9C7A?loc=35.11118%2C-89.97476%2C12.71z&legend=1&cooperativeGestures=1&link=1&geolocation=0&zoomControls=1&scaleBar=1"
}
    {
      icon: "🎯",
      title: "Businesses against Blight",
      link: "https://ilovememphisblog.com/entrepreneurs-small-business",
      description: "Monitor resolved reports and see the impact of community cleanup efforts.",
      color: "from-primary/10 to-transparent",
    },
    {
      icon: "⭐",
      title: "Earn Rewards",
      description: "Gain points and recognition for your contributions to neighborhood improvement.",
      color: "from-accent/10 to-transparent",
    },
    {
      icon: "🏆",
      title: "Cleanup fun & Earn",
       link: "https://www.meetup.com/find/us--tn--memphis/",
      description: "Contribute to clean up days in your community.",
      color: "from-primary/10 to-transparent",
    },
    {
      icon: "🔔",
      title: "Stay Connected",
      link: "https://311.memphistn.gov/public/Home/Contact",
      description: "Receive notifications about new reports and achievements in your neighborhood.",
      color: "from-accent/10 to-transparent",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">Why Join BlightWatch?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform Memphis neighborhoods through community-driven action
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${feature.color} bg-card border-2 border-border rounded-lg p-8 hover:border-primary hover:shadow-lg transition-all group`}
          >
            <p className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</p>
            {feature.link ? (
              <a href={feature.link} target="_blank" rel="noopener noreferrer">
                <h3 className="text-lg font-bold text-card-foreground mb-3 hover:text-primary transition-colors cursor-pointer">
                  {feature.title}
                </h3>
              </a>
            ) : feature.onClick ? (
              <h3 
                onClick={feature.onClick}
                className="text-lg font-bold text-card-foreground mb-3 hover:text-primary transition-colors cursor-pointer"
              >
                {feature.title}
              </h3>
            ) : (
              <h3 className="text-lg font-bold text-card-foreground mb-3">{feature.title}</h3>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}