import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function CTASection() {
  const t = await getTranslations("CTA");

  return (
    <section className="py-24 relative overflow-hidden bg-cream/50">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white backdrop-blur-md border-2 border-soft-blue-dark/70 rounded-[3rem] p-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-ink font-[family-name:var(--font-fredoka)]">
            {t("title")}{" "}
            <span className="text-soft-blue-dark">{t("titleHighlight")}</span>{" "}
            {t("titleSuffix")}
          </h2>
          <p className="text-2xl text-ink/70 mb-12 max-w-2xl mx-auto font-[family-name:var(--font-fredoka)]">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/generator"
              className="w-full sm:w-auto px-12 py-5 bg-soft-blue-dark text-white text-xl font-bold rounded-2xl hover:bg-ink transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t("button")}
            </Link>
          </div>
          <div className="mt-8 text-sm text-ink/40 font-medium">
            {t("noCard")}
          </div>
        </div>
      </div>
    </section>
  );
}
