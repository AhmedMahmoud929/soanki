import Image from "next/image";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB07HdI9I5b91C0B8zNkp6ZuujZehYuKhD15sc7KdCymzJy8-f12nJePjPvdWFuxzs8uJGlIKipr0hMPATQVNhttTmOuNfMMhL05Q3PxoqLk60J0FkNugRV4FWEOURbJHQyCVPJY5QqQzU3kLu0GLuGO2Z-T18rLo67nHKshzKU1UiFI5xKejuNuZz2AnRe4ZQtt0GxU2DaIqA4MUffcMWYtu5UZnBAahl0d0QUMqJ1P8D3XTVo9fbrSEm79EYQ0MH6hfavKdJ-my8i";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-soft-blue/10 rounded-[var(--radius-blob)] blur-2xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-soft-yellow/10 rounded-[var(--radius-blob)] blur-2xl -z-10" />
      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-soft-blue/20 text-soft-blue-dark text-sm font-bold mb-8 shadow-sm">
          <span className="flex h-3 w-3 rounded-full bg-soft-orange" />
          <span className="font-[family-name:var(--font-patrick-hand)] text-lg">
            Powered by Gemini AI magic ✨
          </span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight max-w-5xl mx-auto text-ink font-[family-name:var(--font-fredoka)]">
          Automate your <br />
          <span className="marker-highlight">Anki vocab decks</span>
        </h1>
        <p className="text-xl md:text-2xl text-ink/70 max-w-2xl mx-auto mb-12 font-[family-name:var(--font-patrick-hand)] leading-relaxed">
          Stop wasting hours on manual data entry. Create beautiful, media-rich
          flashcards with images and native audio in seconds. Ideally simple for
          students.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#"
            className="w-full sm:w-auto px-8 py-4 bg-soft-orange text-white text-xl font-bold rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1 transition-all border-b-4 border-orange-600 active:border-b-0 active:translate-y-1"
          >
            Get Started for Free
          </a>
          <a
            href="#"
            className="w-full sm:w-auto px-8 py-4 bg-white text-ink text-xl font-bold rounded-2xl border-2 border-ink/10 shadow-sm hover:border-soft-blue-dark hover:text-soft-blue-dark transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">play_circle</span>
            Watch Demo
          </a>
        </div>
        <div className="mt-20 relative mx-auto max-w-3xl">
          <div className="bg-white p-2 rounded-3xl shadow-xl border-4 border-ink/5 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <Image
              src={"/images/home-hero-preview.png"}
              alt="Screenshot of an elegant minimalist flashcard app interface"
              width={1000}
              height={520}
              className="w-full h-auto rounded-2xl"
              priority
            />
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-soft-yellow rounded-full flex items-center justify-center text-3xl shadow-lg transform rotate-12 hidden md:flex font-[family-name:var(--font-patrick-hand)] font-bold text-ink border-2 border-ink/10">
            Wow!
          </div>
        </div>
      </div>
    </section>
  );
}
