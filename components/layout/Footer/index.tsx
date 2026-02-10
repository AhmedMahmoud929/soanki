import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Contact Support" },
];

const socialLinks = [
  { href: "#", icon: "thumb_up" },
  { href: "#", icon: "public" },
];

export function Footer() {
  return (
    <footer className="py-12 bg-white border-t border-ink/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-soft-blue text-white rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-ink font-[family-name:var(--font-fredoka)]">
              Soanki
            </span>
          </div>
          <div className="flex gap-8 text-lg font-[family-name:var(--font-patrick-hand)] text-ink/60">
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
                <span className="material-symbols-outlined text-xl">
                  {link.icon}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center text-ink/30 text-sm font-[family-name:var(--font-patrick-hand)]">
          © 2024 Soanki AI. Crafted with ♥ for language learners everywhere.
        </div>
      </div>
    </footer>
  );
}
