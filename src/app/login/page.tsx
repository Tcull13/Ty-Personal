import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibe-purple via-vibe-pink to-vibe-cyan flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 3L20 9V15L12 21L4 15V9L12 3Z" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="4" y1="9" x2="20" y2="9" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg">VibeScapes</span>
          </Link>
          <h1 className="font-display text-2xl font-bold mt-8 mb-2">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to continue your story</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-vibe-purple/50 focus:ring-1 focus:ring-vibe-purple/30 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-vibe-purple/50 focus:ring-1 focus:ring-vibe-purple/30 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
            Sign In
          </button>
        </div>
        <p className="text-center text-sm text-muted mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}