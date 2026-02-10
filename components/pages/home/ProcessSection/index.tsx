const steps = [
  {
    step: 1,
    label: "Step 1",
    title: "Input Your Words",
    description:
      "Simply paste your vocabulary list or upload a file. We handle the messy formatting for you.",
    icon: "edit_note",
    colorClass: "border-soft-blue text-soft-blue-dark",
    labelColor: "text-soft-blue",
    align: "left" as const,
  },
  {
    step: 2,
    label: "Step 2",
    title: "Gemini Analysis",
    description:
      "Our AI reads your words, understands the context, finds definitions, and creates example sentences.",
    icon: "psychology",
    colorClass: "border-soft-blue-dark text-soft-blue-dark",
    labelColor: "text-soft-blue-dark",
    align: "right" as const,
  },
  {
    step: 3,
    label: "Step 3",
    title: "Visual Learning",
    description:
      "We generate unique, memorable images for each card to help stick the meaning in your brain.",
    icon: "palette",
    colorClass: "border-soft-yellow text-yellow-500",
    labelColor: "text-soft-yellow",
    align: "left" as const,
  },
  {
    step: 4,
    label: "Step 4",
    title: "Native Audio",
    description:
      "High-fidelity Text-to-Speech generates perfect pronunciation in your target language.",
    icon: "graphic_eq",
    colorClass: "border-soft-orange text-orange-500",
    labelColor: "text-soft-orange",
    align: "right" as const,
  },
  {
    step: 5,
    label: "Step 5",
    title: "Download Deck",
    description:
      "Get your ready-to-use .apkg file. Import to Anki and start learning immediately!",
    icon: "download_done",
    colorClass: "bg-soft-blue-dark text-white border-4 border-white",
    labelColor: "text-soft-blue-dark",
    align: "left" as const,
    isLast: true,
  },
];

export function ProcessSection() {
  return (
    <section className="py-32 relative" id="process">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24">
          <span className="bg-soft-blue/10 text-soft-blue-dark px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase mb-4 inline-block">
            The Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-ink font-[family-name:var(--font-fredoka)]">
            From Word List to Mastered
          </h2>
          <p className="text-xl text-ink/60 font-[family-name:var(--font-patrick-hand)]">
            A simple 5-step automated pipeline designed for learners.
          </p>
        </div>
        <div className="relative">
          <div className="timeline-line w-1" />
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`relative z-10 ${index < steps.length - 1 ? "mb-20 md:mb-32" : ""}`}
            >
              <div
                className={`flex flex-col md:flex-row ${item.align === "right" ? "md:flex-row-reverse" : ""} items-center gap-8 md:gap-16`}
              >
                <div
                  className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 z-10 ${
                    item.isLast
                      ? item.colorClass
                      : `bg-white border-4 ${item.colorClass}`
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl md:text-5xl">
                    {item.icon}
                  </span>
                </div>
                <div
                  className={`text-center md:w-1/2 ${
                    item.align === "right" ? "md:text-right" : "md:text-left"
                  } ${
                    item.isLast
                      ? "bg-soft-blue/10 p-8 rounded-3xl border-2 border-soft-blue/20"
                      : "bg-white p-6 rounded-3xl border-2 border-ink/5 shadow-sm"
                  }`}
                >
                  <span
                    className={`${item.labelColor} font-bold text-lg mb-2 block font-[family-name:var(--font-patrick-hand)]`}
                  >
                    {item.label}
                  </span>
                  <h3 className="text-3xl font-bold mb-3 text-ink">
                    {item.title}
                  </h3>
                  <p
                    className={`text-lg leading-relaxed font-[family-name:var(--font-patrick-hand)] ${item.isLast ? "text-ink/70" : "text-ink/60"}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
