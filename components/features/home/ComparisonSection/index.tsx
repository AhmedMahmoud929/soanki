import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";

export async function ComparisonSection() {
  const t = await getTranslations("Comparison");

  return (
    <section className="py-24 md:py-32 bg-cream/50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-ink font-[family-name:var(--font-fredoka)]">
            {t("title")}
          </h2>
          <p className="text-xl text-ink/60 font-[family-name:var(--font-fredoka)]">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="hand-drawn-border bg-white p-10 relative group">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 border-2 border-ink/10 rounded-full shadow-sm">
              <span className="font-[family-name:var(--font-fredoka)] font-bold text-2xl text-red-400">
                {t("hardWay")}
              </span>
            </div>
            <div className="mt-6 space-y-8">
              {[
                { key: "manual", icon: "solar:clipboard-remove-bold" },
                { key: "images", icon: "solar:gallery-remove-bold" },
                { key: "audio", icon: "solar:microphone-bold" },
              ].map(({ key, icon }) => (
                <div
                  key={key}
                  className="flex items-start gap-4 opacity-70"
                >
                  <Icon icon={icon} className="text-4xl text-ink/30 size-10" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {t(`hardWayItems.${key}.title`)}
                    </h4>
                    <p className="text-sm font-[family-name:var(--font-fredoka)] text-ink/60 text-lg">
                      {t(`hardWayItems.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/10 text-center">
                <span className="text-red-400 font-bold text-xl font-[family-name:var(--font-fredoka)]">
                  {t("hardWayTime")}
                </span>
              </div>
            </div>
          </div>

          <div className="hand-drawn-border bg-white p-10 relative border-soft-blue-dark shadow-[var(--shadow-soft-hover)] transform md:-rotate-1 transition-transform hover:rotate-0">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-soft-blue text-white px-6 py-2 border-2 border-soft-blue-dark rounded-full shadow-md z-10">
              <span className="font-[family-name:var(--font-fredoka)] font-bold text-2xl">
                {t("soankiWay")}
              </span>
            </div>
            <div className="mt-6 space-y-8">
              {[
                { key: "instant", icon: "solar:magic-stick-3-bold", iconBg: "bg-soft-blue/20 text-soft-blue-dark" },
                { key: "illustrations", icon: "mage:image-fill", iconBg: "bg-soft-yellow/20 text-yellow-600" },
                { key: "speech", icon: "lets-icons:sound-max-fill", iconBg: "bg-soft-orange/20 text-orange-600" },
              ].map(({ key, icon, iconBg }) => (
                <div key={key} className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl ${iconBg}`}>
                    <Icon icon={icon} className="text-3xl size-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {t(`soankiWayItems.${key}.title`)}
                    </h4>
                    <p className="text-sm font-[family-name:var(--font-fredoka)] text-ink/70 text-lg">
                      {t(`soankiWayItems.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-soft-blue/20 text-center">
                <span className="text-soft-blue-dark font-bold text-xl font-[family-name:var(--font-fredoka)]">
                  {t("soankiWayTime")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
