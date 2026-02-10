"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";

const localeCodes = ["en", "de", "ar"] as const;

const localeFlags: Record<(typeof localeCodes)[number], string> = {
  en: "/images/flags/united-kingdom.png",
  de: "/images/flags/german.png",
  ar: "/images/flags/egypt.png",
};

export function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const navLinks = [
    // { href: "/#features", label: t("features") },
    // { href: "/#process", label: t("howItWorks") },
    // { href: "#pricing", label: t("pricing") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/90 backdrop-blur-sm border-b-2 border-ink/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Logo href="/" size="md" />

        <nav className="hidden md:flex items-center gap-8 font-medium text-lg text-ink/70">
          {[].map((link: any) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-soft-blue-dark transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-soft-blue rounded-full transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-2xl bg-cream text-ink font-semibold hover:bg-soft-yellow/20 border-2 border-transparent hover:border-soft-yellow/50 px-4 py-2 h-auto"
              >
                <Image
                  src={localeFlags[locale as (typeof localeCodes)[number]] ?? localeFlags.en}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-sm object-cover shrink-0"
                />
                <span className="uppercase">{locale}</span>
                <ChevronDown className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-2xl border-2 border-ink/5 shadow-[var(--shadow-card)]"
            >
              {localeCodes.map((code) => (
                <DropdownMenuItem key={code} asChild>
                  <Link
                    href="/"
                    locale={code}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer font-medium hover:bg-cream"
                    dir={code === "ar" ? "rtl" : "ltr"}
                  >
                    <Image
                      src={localeFlags[code]}
                      alt=""
                      width={20}
                      height={20}
                      className="rounded-sm object-cover shrink-0"
                    />
                    {t(`locales.${code}`)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/generator"
            className={cn(
              "hidden md:block px-6 py-2.5 bg-soft-blue-dark text-white font-bold rounded-2xl",
              "shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-0.5",
              "transition-all transform active:scale-95 border-2 border-transparent"
            )}
          >
            {t("startGenerating")}
          </Link>
        </div>
      </div>
    </header>
  );
}
