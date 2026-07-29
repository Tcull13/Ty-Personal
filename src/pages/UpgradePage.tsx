import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

interface Storefront {
  id: number;
  businessName: string;
  phone: string;
  email: string | null;
  slug: string;
  plan: string;
}

export default function UpgradePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get("canceled") === "true";
  const [biz, setBiz] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          navigate("/login", { replace: true });
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.storefront) {
          setBiz(data.storefront);
        }
        setLoading(false);
      })
      .catch(() => {
        navigate("/login", { replace: true });
        setLoading(false);
      });
  }, [navigate]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError("");
    try {
      const res = await fetch("/api/upgrade", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setUpgrading(false);
        return;
      }
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setUpgrading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-doorway-light flex items-center justify-center">
        <div className="text-doorway-gray">Loading...</div>
      </div>
    );
  }

  if (!biz) return null;

  // Already premium
  if (biz.plan === "premium") {
    return (
      <div className="min-h-screen bg-doorway-light">
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#1A7A7A" />
                <path d="M8 24V16L24 8V16L8 24Z" fill="#F5A623" opacity="0.9" />
                <path d="M10 22V17L22 11V16L10 22Z" fill="white" opacity="0.8" />
              </svg>
              <span className="font-heading font-bold text-lg text-doorway-dark">Doorway</span>
            </Link>
            <Link to="/dashboard" className="text-doorway-teal text-sm font-semibold hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="font-heading text-3xl font-bold text-doorway-dark mb-4">
            You're Already Premium!
          </h1>
          <p className="text-doorway-gray mb-8">
            Thanks for being a Doorway Premium member. Your storefront is ad-free with advanced features.
          </p>
          <Link
            to="/dashboard"
            className="bg-doorway-teal text-white px-8 py-3 rounded-xl font-semibold hover:bg-doorway-teal-light transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-doorway-light">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1A7A7A" />
              <path d="M8 24V16L24 8V16L8 24Z" fill="#F5A623" opacity="0.9" />
              <path d="M10 22V17L22 11V16L10 22Z" fill="white" opacity="0.8" />
            </svg>
            <span className="font-heading font-bold text-lg text-doorway-dark">Doorway</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-doorway-gray hidden sm:inline">{biz.businessName}</span>
            <Link to="/dashboard" className="text-doorway-teal text-sm font-semibold hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Canceled notice */}
        {canceled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-amber-800 text-sm">
              You canceled the checkout. No worries — you can upgrade anytime.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-doorway-amber/10 text-doorway-amber text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            ⚡ Doorway Premium
          </div>
          <h1 className="font-heading text-4xl font-bold text-doorway-dark mb-4">
            Upgrade Your Storefront
          </h1>
          <p className="text-doorway-gray text-lg max-w-xl mx-auto">
            Get a professional look, advanced insights, and more ways to grow your business.
          </p>
        </div>

        {/* Pricing card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-doorway-teal overflow-hidden">
            <div className="bg-doorway-teal px-6 py-8 text-white text-center">
              <p className="text-sm uppercase tracking-wider font-semibold opacity-80 mb-2">Premium Plan</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-white/70">/month</span>
              </div>
              <p className="text-sm text-white/70 mt-1">Cancel anytime</p>
            </div>

            <div className="px-6 py-8">
              <ul className="space-y-4">
                {[
                  { icon: "🌐", text: "Custom domain (yourbusiness.com)", free: false },
                  { icon: "🚫", text: "No \"Powered by Doorway\" branding", free: false },
                  { icon: "📊", text: "Advanced analytics & insights", free: false },
                  { icon: "⭐", text: "Review collection widget", free: false },
                  { icon: "📅", text: "Scheduling widget", free: false },
                  { icon: "👥", text: "Team member listings", free: false },
                  { icon: "📄", text: "Multiple pages", free: false },
                  { icon: "⚡", text: "Priority support", free: false },
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{feature.icon}</span>
                    <span className="text-doorway-dark text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full mt-8 bg-doorway-amber text-white py-4 rounded-xl font-bold text-lg hover:bg-doorway-amber-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {upgrading ? "Redirecting to checkout..." : "Upgrade for $19/mo"}
              </button>

              <p className="text-xs text-doorway-gray text-center mt-4">
                🔒 Secure payment powered by Stripe. Cancel anytime.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="text-center mt-12">
          <p className="text-doorway-gray text-sm">
            Questions?{" "}
            <Link to="/" className="text-doorway-teal font-semibold hover:underline">
              Check our FAQ
            </Link>{" "}
            or email us at support@doorway.app
          </p>
        </div>
      </div>
    </div>
  );
}
