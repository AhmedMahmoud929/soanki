import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";

const stepKeys = ["1", "2", "3", "4", "5"] as const;
const stepIcons = [
  "solar:document-edit-bold",
  "solar:brain-bold",
  "solar:palette-2-bold",
  "solar:equalizer-bold",
  "solar:download-bold",
] as const;
const stepConfig = [
  { colorClass: "border-soft-blue text-soft-blue-dark", labelColor: "text-soft-blue", align: "left" as const },
  { colorClass: "border-soft-blue-dark text-soft-blue-dark", labelColor: "text-soft-blue-dark", align: "right" as const },
  { colorClass: "border-soft-yellow text-yellow-500", labelColor: "text-soft-yellow", align: "left" as const },
  { colorClass: "border-soft-orange text-orange-500", labelColor: "text-soft-orange", align: "right" as const },
  { colorClass: "bg-soft-blue-dark text-white border-4 border-white", labelColor: "text-soft-blue-dark", align: "left" as const, isLast: true },
];

export async function ProcessSection() {
  const t = await getTranslations("Process");

  return (
    <section className="py-32 relative" id="process">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24">
          <span className="bg-soft-blue/10 text-soft-blue-dark px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase mb-4 inline-block">
            {t("badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-ink font-[family-name:var(--font-fredoka)]">
            {t("title")}
          </h2>
          <p className="text-xl text-ink/60 font-[family-name:var(--font-fredoka)]">
            {t("subtitle")}
          </p>
        </div>
        <div className="relative">
          <div className="timeline-line w-1" />
          {stepKeys.map((key, index) => {
            const config = stepConfig[index];
            return (
              <div
                key={key}
                className={`relative z-10 ${index < stepKeys.length - 1 ? "mb-20 md:mb-32" : ""}`}
              >
                <div
                  className={`flex flex-col md:flex-row ${config.align === "right" ? "md:flex-row-reverse" : ""} items-center gap-8 md:gap-16`}
                >
                  <div
                    className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 z-10 ${
                      config.isLast
                        ? config.colorClass
                        : `bg-white border-4 ${config.colorClass}`
                    }`}
                  >
                    <Icon icon={stepIcons[index]} className="text-4xl md:text-5xl size-12 md:size-14" />
                  </div>
                  <div
                    className={`text-center md:w-1/2 ${
                      config.align === "right" ? "md:text-right" : "md:text-left"
                    } ${
                      config.isLast
                        ? "bg-soft-blue/10 p-8 rounded-3xl border-2 border-soft-blue/20"
                        : "bg-white p-6 rounded-3xl border-2 border-ink/5 shadow-sm"
                    }`}
                  >
                    <span
                      className={`${config.labelColor} font-bold text-lg mb-2 block font-[family-name:var(--font-fredoka)]`}
                    >
                      {t(`steps.${key}.label`)}
                    </span>
                    <h3 className="text-3xl font-bold mb-3 text-ink">
                      {t(`steps.${key}.title`)}
                    </h3>
                    <p
                      className={`text-lg leading-relaxed font-[family-name:var(--font-fredoka)] ${config.isLast ? "text-ink/70" : "text-ink/60"}`}
                    >
                      {t(`steps.${key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
