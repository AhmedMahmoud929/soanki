const features = [
  {
    icon: "translate",
    iconBg: "bg-soft-blue/20 text-soft-blue-dark",
    borderHover: "hover:border-soft-blue",
    title: "Multilingual Support",
    description:
      "Specialized support for English, German, and Arabic. We handle RTL formatting beautifully.",
  },
  {
    icon: "smart_toy",
    iconBg: "bg-soft-yellow/20 text-yellow-600",
    borderHover: "hover:border-soft-yellow",
    title: "Smart Context",
    description:
      "Gemini AI understands idioms and cultural nuances, not just direct translations.",
  },
  {
    icon: "cloud_sync",
    iconBg: "bg-soft-orange/20 text-orange-600",
    borderHover: "hover:border-soft-orange",
    title: "Anki Compatible",
    description:
      "Seamlessly export generated decks directly to your Anki account or download as a file.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-cream/50 relative" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-ink font-[family-name:var(--font-fredoka)]">
            Built for Students
          </h2>
          <div className="h-1 w-20 bg-soft-yellow mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`bg-white p-8 rounded-2xl shadow-sm border-2 border-ink/5 ${feature.borderHover} hover:shadow-[var(--shadow-card)] transition-all group`}
            >
              <div
                className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-ink">
                {feature.title}
              </h3>
              <p className="text-ink/60 font-[family-name:var(--font-patrick-hand)] text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
