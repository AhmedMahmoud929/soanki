import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";

const featureKeys = [
  { key: "multilingual", icon: "solar:translate-bold", iconBg: "bg-soft-blue/20 text-soft-blue-dark", borderHover: "hover:border-soft-blue" },
  { key: "smartContext", icon: "solar:programming-bold", iconBg: "bg-soft-yellow/20 text-yellow-600", borderHover: "hover:border-soft-yellow" },
  { key: "ankiCompatible", icon: "solar:cloud-upload-bold", iconBg: "bg-soft-orange/20 text-orange-600", borderHover: "hover:border-soft-orange" },
] as const;

export async function FeaturesSection() {
  const t = await getTranslations("Features");

  return (
    <section className="py-24 bg-cream/50 relative" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-ink font-[family-name:var(--font-fredoka)]">
            {t("title")}
          </h2>
          <div className="h-1 w-20 bg-soft-yellow mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featureKeys.map(({ key, icon, iconBg, borderHover }) => (
            <div
              key={key}
              className={`bg-white p-8 rounded-2xl shadow-sm border-2 border-ink/5 ${borderHover} hover:shadow-[var(--shadow-card)] transition-all group`}
            >
              <div
                className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
<Icon icon={icon} className="text-3xl size-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-ink">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-ink/60 font-[family-name:var(--font-fredoka)] text-lg">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
