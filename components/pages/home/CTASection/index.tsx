export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-cream backdrop-blur-md border-2 border-soft-blue-dark/70 rounded-[3rem] p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-ink font-[family-name:var(--font-fredoka)]">
            Ready to <span className="text-soft-blue-dark">master</span> your
            vocabulary?
          </h2>
          <p className="text-2xl text-ink/70 mb-12 max-w-2xl mx-auto font-[family-name:var(--font-patrick-hand)]">
            Join 10,000+ happy students saving thousands of hours. Study what
            matters, automate the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#"
              className="w-full sm:w-auto px-12 py-5 bg-soft-blue-dark text-white text-xl font-bold rounded-2xl hover:bg-ink transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Start Generating Now
            </a>
          </div>
          <div className="mt-8 text-sm text-ink/40 font-medium">
            No credit card required for trial
          </div>
        </div>
      </div>
    </section>
  );
}
