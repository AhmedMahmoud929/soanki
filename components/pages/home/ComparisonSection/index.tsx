const hardWayItems = [
  {
    icon: "content_paste_off",
    title: "Manual Copy-Paste",
    description:
      "Click, drag, copy, switch tab, paste. Repeat 100x.",
  },
  {
    icon: "image_not_supported",
    title: "Finding Images",
    description:
      'Searching Google images for "apple" without getting logos.',
  },
  {
    icon: "record_voice_over",
    title: "Robotic Audio",
    description:
      "Downloading weird computer voices that sound scary.",
  },
];

const soankiWayItems = [
  {
    icon: "auto_fix_high",
    iconBg: "bg-soft-blue/20 text-soft-blue-dark",
    title: "Instant Magic",
    description: "Paste a list. Go grab a coffee. Done.",
  },
  {
    icon: "brush",
    iconBg: "bg-soft-yellow/20 text-yellow-600",
    title: "AI Illustrations",
    description: "Perfectly matching images generated on the fly.",
  },
  {
    icon: "headphones",
    iconBg: "bg-soft-orange/20 text-orange-600",
    title: "Natural Speech",
    description: "Sounds like a real native speaker tailored to you.",
  },
];

export function ComparisonSection() {
  return (
    <section className="py-24 bg-cream/50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-ink font-[family-name:var(--font-fredoka)]">
            Old Way vs. Soanki Way
          </h2>
          <p className="text-xl text-ink/60 font-[family-name:var(--font-patrick-hand)]">
            Why study hard when you can study smart?
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* The Hard Way */}
          <div className="hand-drawn-border bg-white p-10 relative group">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 border-2 border-ink/10 rounded-full shadow-sm">
              <span className="font-[family-name:var(--font-patrick-hand)] font-bold text-2xl text-red-400">
                The Hard Way 😓
              </span>
            </div>
            <div className="mt-6 space-y-8">
              {hardWayItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 opacity-70"
                >
                  <span className="material-symbols-outlined text-4xl text-ink/30 scribble-icon">
                    {item.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-sm font-[family-name:var(--font-patrick-hand)] text-ink/60 text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/10 text-center">
                <span className="text-red-400 font-bold text-xl font-[family-name:var(--font-patrick-hand)]">
                  Takes ~50 mins per deck!
                </span>
              </div>
            </div>
          </div>

          {/* The Soanki Way */}
          <div className="hand-drawn-border bg-white p-10 relative border-soft-blue-dark shadow-[var(--shadow-soft-hover)] transform md:-rotate-1 transition-transform hover:rotate-0">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-soft-blue text-white px-6 py-2 border-2 border-soft-blue-dark rounded-full shadow-md z-10">
              <span className="font-[family-name:var(--font-patrick-hand)] font-bold text-2xl">
                The Soanki Way 🚀
              </span>
            </div>
            <div className="mt-6 space-y-8">
              {soankiWayItems.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-xl ${item.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-sm font-[family-name:var(--font-patrick-hand)] text-ink/70 text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-soft-blue/20 text-center">
                <span className="text-soft-blue-dark font-bold text-xl font-[family-name:var(--font-patrick-hand)]">
                  Takes ~50 seconds!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
