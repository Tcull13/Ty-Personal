import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibe-purple via-vibe-pink to-vibe-cyan flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3L20 9V15L12 21L4 15V9L12 3Z" />
                <path d="M12 3L20 9V15L12 21L4 15V9L12 3Z" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="4" y1="9" x2="20" y2="9" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              VibeScapes
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#templates" className="hover:text-white transition-colors">
              Templates
            </a>
            <Link
              href="/pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-vibe-purple/20 rounded-full blur-[128px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-vibe-cyan/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vibe-pink/10 rounded-full blur-[160px]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.2 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-muted mb-8">
            <span className="w-2 h-2 rounded-full bg-vibe-cyan animate-glow-pulse" />
            AI-Powered Visual Storytelling
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
            Your{" "}
            <span className="gradient-text">atmosphere</span>
            <br />
            deserves a story.
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted leading-relaxed mb-10">
            VibeScapes lets anyone create vibe-heavy comic books and graphic
            novels using intuitive AI-assisted tools and aesthetic templates. No
            illustration skills? No problem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-base hover:bg-white/90 transition-all"
            >
              Start Creating Free
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 text-white/80 font-medium text-base hover:bg-white/5 hover:border-white/20 transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
              See How It Works
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-xs">
          <span>Scroll to explore</span>
          <svg
            className="w-4 h-4 animate-bounce"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative px-6 py-24 sm:py-32 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">create</span>
            </h2>
            <p className="max-w-xl mx-auto text-muted text-lg">
              From blank page to published comic — VibeScapes handles the heavy
              lifting so you can focus on your story.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-purple/20 to-vibe-purple/5 border border-vibe-purple/10 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-vibe-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18 3a3 3 0 010 6h-4l-2 3 2-3h4a3 3 0 000-6z" />
                  <path d="M9 17v-3a3 3 0 013-3h2" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">
                AI Art Generation
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Describe your scene and watch the AI bring it to life. Choose
                from dozens of art styles — from manga to watercolor to
                cyberpunk.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-pink/20 to-vibe-pink/5 border border-vibe-pink/10 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-vibe-pink"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">
                Aesthetic Templates
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Start with professionally designed comic layouts, panel
                structures, and color palettes. Customize every detail to match
                your vibe.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-cyan/20 to-vibe-cyan/5 border border-vibe-cyan/10 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-vibe-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  <path d="M10 8l3 3-3 3" />
                  <path d="M14 8l3 3-3 3" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">
                Print-on-Demand
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Your masterpiece deserves to be on paper. Order high-quality
                physical copies of your comic or graphic novel with one click.
              </p>
            </div>
          </div>

          {/* Second row of features */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Feature 4 */}
            <div className="group relative p-8 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-indigo/20 to-vibe-indigo/5 border border-vibe-indigo/10 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-vibe-indigo"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">
                Collaborative Editing
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Invite writers, artists, and editors to work on your comic
                together in real-time. Storytelling is better with friends.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative p-8 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-purple/20 to-vibe-purple/5 border border-vibe-purple/10 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-vibe-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">
                Curated Styles
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Pro subscription unlocks exclusive art styles, unlimited
                high-res exports, and premium templates curated by professional
                comic artists.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative p-8 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-cyan/20 to-vibe-cyan/5 border border-vibe-cyan/10 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-vibe-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">
                Vibe Community
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Share your creations, remix templates from other creators, and
                find inspiration in a community of visual storytellers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section
        id="templates"
        className="relative px-6 py-24 sm:py-32 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Start with a{" "}
              <span className="gradient-text">vibe</span>
            </h2>
            <p className="max-w-xl mx-auto text-muted text-lg">
              Choose from our curated collection of aesthetic templates. Each
              one is designed to set the perfect mood for your story.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Template cards */}
            {[
              {
                title: "Neon Nights",
                description: "Cyberpunk cityscapes with glowing aesthetics",
                gradient: "from-vibe-purple to-vibe-pink",
              },
              {
                title: "Dreamscape",
                description: "Soft, ethereal watercolor-inspired panels",
                gradient: "from-vibe-cyan to-vibe-purple",
              },
              {
                title: "Dark Academia",
                description: "Moody, textured vintage comic feel",
                gradient: "from-amber-800 to-stone-800",
              },
              {
                title: "Kawaii Core",
                description: "Bright, cute manga-style storytelling",
                gradient: "from-vibe-pink to-amber-400",
              },
              {
                title: "Midnight Noir",
                description: "High-contrast black and white drama",
                gradient: "from-zinc-700 to-zinc-900",
              },
              {
                title: "Solarpunk",
                description: "Warm, optimistic eco-futurism vibes",
                gradient: "from-emerald-400 to-vibe-cyan",
              },
            ].map((template, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${template.gradient}`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-full h-32 rounded-xl bg-gradient-to-br ${template.gradient} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                  <h3 className="font-display font-semibold text-base mb-1">
                    {template.title}
                  </h3>
                  <p className="text-muted text-sm">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 sm:py-32 border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vibe-purple/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to create your{" "}
            <span className="gradient-text">magnum opus</span>?
          </h2>
          <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
            Join thousands of creators who are already bringing their visual
            stories to life. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-medium text-lg hover:bg-white/90 transition-all"
          >
            Start Creating Free
            <svg
              className="w-5 h-5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-vibe-purple via-vibe-pink to-vibe-cyan flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M12 3L20 9V15L12 21L4 15V9L12 3Z" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <line x1="4" y1="9" x2="20" y2="9" />
                </svg>
              </div>
              <span className="font-display font-bold">VibeScapes</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>
          <p className="text-center sm:text-left text-xs text-muted mt-8">
            &copy; {new Date().getFullYear()} VibeScapes. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}