import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#process", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
];

const languageOptions = [
  { code: "EN", label: "English (EN)", dir: "ltr" },
  { code: "DE", label: "Deutsch (DE)", dir: "ltr" },
  { code: "AR", label: "العربية (AR)", dir: "rtl" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-paper/90 backdrop-blur-sm border-b-2 border-ink/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-soft-blue text-white rounded-full flex items-center justify-center shadow-[var(--shadow-soft)] border-2 border-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-ink font-[family-name:var(--font-fredoka)]">
            Soanki
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-lg text-ink/70">
          {navLinks.map((link) => (
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
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cream text-ink font-semibold hover:bg-soft-yellow/20 transition-all border-2 border-transparent hover:border-soft-yellow/50"
            >
              <span className="material-symbols-outlined text-xl">
                language
              </span>
              <span>EN</span>
              <span className="material-symbols-outlined text-xl">
                expand_more
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-[var(--shadow-card)] border-2 border-ink/5 hidden group-hover:block overflow-hidden z-50">
              {languageOptions.map((opt) => (
                <Link
                  key={opt.code}
                  href="#"
                  className="block px-4 py-3 hover:bg-cream transition-colors font-medium"
                  dir={opt.dir}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="#"
            className="hidden md:block px-6 py-2.5 bg-soft-blue-dark text-white font-bold rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-0.5 transition-all transform active:scale-95 border-2 border-transparent"
          >
            Start Generating
          </Link>
        </div>
      </div>
    </header>
  );
}
