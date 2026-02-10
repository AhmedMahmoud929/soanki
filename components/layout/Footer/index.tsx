import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";

export async function Footer() {
  const t = await getTranslations("Footer");

  const footerLinks = [
    { href: "#", label: t("privacy") },
    { href: "#", label: t("terms") },
    { href: "#", label: t("contact") },
  ];

  const socialLinks = [
    { href: "#", icon: "solar:like-bold" },
    { href: "#", icon: "solar:global-bold" },
  ] as const;

  return (
    <footer className="py-12 bg-paper border-t border-ink/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo href="/" />
          <div className="flex gap-8 text-lg font-[family-name:var(--font-fredoka)] text-ink/60">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-soft-blue-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.icon}
                href={link.href}
                className="w-12 h-12 rounded-full bg-cream flex items-center justify-center hover:bg-soft-blue hover:text-white transition-all text-ink/70"
              >
                <Icon icon={link.icon} className="text-xl" />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center text-ink/30 text-sm font-[family-name:var(--font-fredoka)]">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
