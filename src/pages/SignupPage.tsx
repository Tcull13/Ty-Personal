import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ChevronRight, Download, ArrowRight } from "lucide-react";

const BUSINESS_TYPES = [
  "Plumber",
  "Electrician",
  "Cleaner",
  "Landscaper",
  "Painter",
  "Handyman",
  "HVAC Technician",
  "Roofer",
  "Mover",
  "Pest Control",
  "Carpenter",
  "Locksmith",
  "Auto Detailer",
  "Pressure Washer",
  "Other",
];

interface SignupResult {
  storefront: {
    id: number;
    businessName: string;
    phone: string;
    email: string;
    slug: string;
    createdAt: string;
  };
  token: string;
}

export default function SignupPage() {
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
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
  const [success, setSuccess] = useState<SignupResult | null>(null);

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

  const handleBusinessTypeChange = (value: string) => {
    setForm({ ...form, businessType: value });
    // Auto-populate services based on business type
    const defaultServices: Record<string, string> = {
      Plumber: "Drain Cleaning\nPipe Repair\nWater Heater Install\nLeak Detection\nFixture Installation",
      Electrician: "Panel Upgrades\nWiring & Rewiring\nLighting Installation\nOutlet Repair\nCircuit Breaker Replacement",
      Cleaner: "Deep Cleaning\nRegular Maintenance\nMove-In/Out Cleaning\nWindow Cleaning\nOffice Cleaning",
      Landscaper: "Lawn Mowing\nHedge Trimming\nMulching\nLeaf Removal\nSod Installation",
      Painter: "Interior Painting\nExterior Painting\nCabinet Painting\nDrywall Repair\nDeck Staining",
      Handyman: "Furniture Assembly\nDrywall Repair\nFixture Installation\nMinor Plumbing\nGeneral Repairs",
      "HVAC Technician": "AC Repair\nFurnace Installation\nDuct Cleaning\nThermostat Setup\nMaintenance",
      Roofer: "Roof Repair\nShingle Replacement\nGutter Cleaning\nInspection\nLeak Repair",
      Mover: "Local Moving\nPacking Services\nFurniture Assembly\nLoading/Unloading\nJunk Removal",
      "Pest Control": "Termite Treatment\nRodent Removal\nBed Bug Treatment\nMosquito Control\nInspections",
      Carpenter: "Custom Furniture\nCabinet Building\nDeck Construction\nTrim Work\nRepairs",
      Locksmith: "Lock Installation\nEmergency Unlock\nKey Duplication\nSafe Installation\nRekeying",
      "Auto Detailer": "Interior Detailing\nExterior Wash & Wax\nPaint Correction\nCeramic Coating\nHeadlight Restoration",
      "Pressure Washer": "Driveway Cleaning\nHouse Washing\nDeck Cleaning\nFence Cleaning\nGutter Cleaning",
    };
    if (defaultServices[value] && !form.services) {
      setForm({ ...form, businessType: value, services: defaultServices[value] });
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
      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const storefrontUrl = success
    ? `${window.location.origin}/${success.storefront.slug}`
    : "";

  // Success state — show QR code with download prompt
  if (success) {
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

        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="font-heading text-3xl font-bold text-doorway-dark mb-2">
            Your storefront is live!
          </h1>
          <p className="text-doorway-gray mb-8">
            Here's your QR code — download it and put it on your truck, flyers, and invoices.
          </p>

          {/* QR Code */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-doorway-teal/20 p-6 mb-6 inline-block">
            <div className="bg-white p-4 rounded-xl border-2 border-gray-100 mb-4">
              <QRCodeSVG value={storefrontUrl} size={200} />
            </div>
            <p className="text-sm font-semibold text-doorway-dark mb-1">{success.storefront.businessName}</p>
            <p className="text-xs text-doorway-gray mb-4">doorway.app/{success.storefront.slug}</p>

            <div className="flex flex-col gap-2">
              <a
                href={`/api/storefronts/${success.storefront.slug}/qr.png`}
                download
                className="inline-flex items-center justify-center gap-2 bg-doorway-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-doorway-teal-light transition-colors"
              >
                <Download className="w-5 h-5" />
                Download QR Code (PNG)
              </a>
              <a
                href={`/api/storefronts/${success.storefront.slug}/qr/pdf`}
                download
                className="inline-flex items-center justify-center gap-2 border-2 border-doorway-teal text-doorway-teal px-6 py-3 rounded-xl font-semibold hover:bg-doorway-teal/5 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Truck Magnet (PDF)
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-doorway-teal font-semibold hover:underline"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-doorway-gray">|</span>
            <a
              href={storefrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-doorway-teal font-semibold hover:underline"
            >
              View Your Page ↗
            </a>
          </div>

          <p className="text-xs text-doorway-gray mt-6">
            Pro tip: Print your QR code on a sticker and put it on your truck door. That's where most of your customers will find you.
          </p>
        </div>
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
          {/* Business type dropdown */}
          <div>
            <label className="block text-sm font-semibold text-doorway-dark mb-1">What kind of business? *</label>
            <select
              value={form.businessType}
              onChange={(e) => handleBusinessTypeChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal focus:border-transparent bg-white text-doorway-dark"
            >
              <option value="" disabled>Select your trade...</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p className="text-xs text-doorway-gray mt-1">We'll pre-fill services for your trade.</p>
          </div>

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
            <label className="block text-sm font-semibold text-doorway-dark mb-1">Email</label>
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
            className="w-full bg-doorway-teal text-white py-3.5 rounded-xl font-bold text-lg hover:bg-doorway-teal-light transition-colors shadow-lg shadow-doorway-teal/20 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : (
              <>Create Your Free Storefront <ChevronRight className="w-5 h-5" /></>
            )}
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
