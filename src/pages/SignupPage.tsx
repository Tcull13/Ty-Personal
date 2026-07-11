import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    website: "",
    services: "",
    serviceArea: "",
    description: "",
    password: "",
  });
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    setForm({ ...form, businessName: value });
    if (value) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.businessName || !form.phone || !form.services || !form.password) {
      setError("Business name, phone, services, and password are required.");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

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

      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-doorway-dark mb-2">
          Create your free storefront
        </h1>
        <p className="text-doorway-gray mb-8">
          Takes 30 seconds. No credit card needed.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Business Name *</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="e.g. River City Plumbing"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Your Name</label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => updateField("ownerName", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="e.g. Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Phone Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Website / Booking Link</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="https://booksy.com/your-link"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Services *</label>
            <textarea
              value={form.services}
              onChange={(e) => updateField("services", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="List your services, one per line:\nDrain Cleaning\nPipe Repair\nWater Heater Installation"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Service Area</label>
            <input
              type="text"
              value={form.serviceArea}
              onChange={(e) => updateField("serviceArea", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="e.g. Portland, OR and surrounding areas"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Short Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="A short blurb about your business"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Your Page URL</label>
            <div className="flex items-center rounded-xl border border-gray-200 px-4 py-3 bg-gray-50">
              <span className="text-doorway-gray text-sm">doorway.app/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                className="bg-transparent flex-1 focus:outline-none text-doorway-dark font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <p className="text-xs text-doorway-gray mt-1">Used to log in to your dashboard.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-doorway-teal text-white py-3.5 rounded-xl font-bold text-lg hover:bg-doorway-teal-light transition-colors shadow-lg shadow-doorway-teal/20 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Your Free Storefront"}
          </button>
        </form>

        <p className="text-center text-sm text-doorway-gray mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-doorway-teal font-semibold hover:underline">
            Log in
          </Link>
        </p>

        <p className="text-xs text-doorway-gray text-center mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
          Your storefront includes "Powered by Doorway" branding on the free plan.
        </p>
      </div>
    </div>
  );
}