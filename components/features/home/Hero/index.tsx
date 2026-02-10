import Image from "next/image";
import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-paper">
      <div className="absolute top-20 left-10 w-64 h-64 bg-soft-blue/10 rounded-[var(--radius-blob)] blur-2xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-soft-yellow/10 rounded-[var(--radius-blob)] blur-2xl -z-10" />
      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-soft-blue/20 text-soft-blue-dark text-sm font-bold mb-8 shadow-sm">
          <span className="flex h-3 w-3 rounded-full bg-soft-orange" />
          <span className="font-[family-name:var(--font-fredoka)] text-lg">
            {t("badge")}
          </span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight max-w-5xl mx-auto text-ink font-[family-name:var(--font-fredoka)]">
          {t("titleLine1")} <br />
          <div className="relative w-fit mx-auto">
            <span className="absolute bg-soft-yellow h-12 bottom-0 left-1/2 -translate-x-1/2 w-full" />
            <span className="relative">{t("titleHighlight")}</span>
          </div>
        </h1>
        <p className="text-xl md:text-2xl text-ink/70 max-w-2xl mx-auto mb-12 font-[family-name:var(--font-fredoka)] leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/generator"
            className="w-full sm:w-auto px-8 py-4 bg-soft-orange text-white text-xl font-bold rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1 transition-all border-b-4 border-orange-600 active:border-b-0 active:translate-y-1"
          >
            {t("getStarted")}
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto px-8 py-4 bg-white text-ink text-xl font-bold rounded-2xl border-2 border-ink/10 shadow-sm hover:border-soft-blue-dark hover:text-soft-blue-dark transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="solar:play-circle-bold" className="text-2xl" />
            {t("watchDemo")}
          </Link>
        </div>
        <div className="mt-20 relative mx-auto max-w-3xl">
          <div className="bg-white p-2 rounded-3xl shadow-xl border-4 border-ink/5 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/images/home-hero-preview.png"
              alt={t("heroImageAlt")}
              width={1000}
              height={520}
              className="w-full h-auto rounded-2xl"
              priority
            />
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-soft-yellow rounded-full flex items-center justify-center text-3xl shadow-lg transform rotate-12 hidden md:flex font-[family-name:var(--font-fredoka)] font-bold text-ink border-2 border-ink/10">
            {t("wow")}
          </div>
        </div>
      </div>
    </section>
  );
}
