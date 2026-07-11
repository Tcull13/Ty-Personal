import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          navigate("/dashboard", { replace: true });
        }
        setCheckingAuth(false);
      })
      .catch(() => setCheckingAuth(false));
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-doorway-light flex items-center justify-center">
        <div className="text-doorway-gray">Checking...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-doorway-light">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#1A7A7A"/>
              <path d="M8 24V16L24 8V16L8 24Z" fill="#F5A623" opacity="0.9"/>
              <path d="M10 22V17L22 11V16L10 22Z" fill="white" opacity="0.8"/>
            </svg>
            <span className="font-heading font-bold text-lg text-doorway-dark">Doorway</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-doorway-dark mb-2">
          Log in to your account
        </h1>
        <p className="text-doorway-gray mb-8">
          Access your storefront dashboard.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-doorway-teal text-white py-3.5 rounded-xl font-bold text-lg hover:bg-doorway-teal-light transition-colors shadow-lg shadow-doorway-teal/20 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-doorway-gray mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-doorway-teal font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}