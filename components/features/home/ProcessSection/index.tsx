import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";

const stepKeys = ["1", "2", "3", "4", "5", "6"] as const;
const stepIcons = [
  "solar:archive-down-bold",
  "solar:document-text-bold",
  "solar:lightbulb-bold",
  "solar:palette-bold",
  "solar:volume-loud-bold",
  "solar:download-bold",
] as const;
const stepBadgeColors = [
  "bg-soft-blue/20 text-soft-blue-dark",
  "bg-soft-blue-dark/20 text-soft-blue-dark",
  "bg-soft-yellow/20 text-yellow-600",
  "bg-soft-orange/20 text-soft-orange",
  "bg-ink/10 text-ink",
  "bg-white/25 text-white",
] as const;

export async function ProcessSection() {
  const t = await getTranslations("Process");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-paper" id="process">
      <div className="container mx-auto px-6 relative">
        <header className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="inline-block bg-soft-blue/10 text-soft-blue-dark px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase mb-4">
            {t("badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-ink font-[family-name:var(--font-fredoka)]">
            {t("title")}
          </h2>
          <p className="text-xl text-ink/60 font-[family-name:var(--font-fredoka)]">
            {t("subtitle")}
          </p>
        </header>

        {/* Steps: horizontal on desktop, vertical on mobile */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-3">
            {stepKeys.map((key, index) => (
              <div
                key={key}
                className="relative flex flex-col items-center text-center "
              >
                {/* Step number + icon card */}
                <div
                  className={`
                    w-full max-w-[320px] lg:max-w-none mx-auto rounded-2xl border-2 p-6 md:p-6
                    transition-all md:py-8 duration-300 relative overflow-hidden 
                    ${index === 5
                      ? "bg-soft-blue-dark text-white border-soft-blue-dark shadow-lg shadow-soft-blue-dark/25"
                      : "bg-white border-ink/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1"
                    }
                  `}
                >
                  <span
                    className="absolute -top-4 -left-3 text-9xl opacity-10 font-semibold"
                  >
                    {key}
                  </span>
                  <div
                    className={`
                      w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center
                      ${index === 5 ? "bg-white/20" : "bg-ink/5"}
                    `}
                  >
                    <Icon
                      icon={stepIcons[index]}
                      className={index === 5 ? "text-3xl text-white" : "text-3xl text-soft-blue-dark"}
                    />
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold mb-2 font-[family-name:var(--font-fredoka)] ${index === 5 ? "text-white" : "text-ink"}`}>
                    {t(`steps.${key}.title`)}
                  </h3>
                  <p
                    className={`text-sm md:text-base leading-relaxed font-[family-name:var(--font-fredoka)] ${index === 5 ? "text-white/90" : "text-ink/60"}`}
                  >
                    {key === "1" ? (
                      <>
                        {t("steps.1.descriptionBeforeLink")}
                        <a
                          href="/files/Soanki - Template.apkg"
                          download="Soanki - Template.apkg"
                          className="text-soft-blue-dark underline hover:text-soft-blue-dark/80"
                        >
                          {t("steps.1.downloadLink")}
                        </a>
                        {t("steps.1.descriptionAfterLink")}
                      </>
                    ) : (
                      t(`steps.${key}.description`)
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
