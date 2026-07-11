import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

interface Storefront {
  id: number;
  businessName: string;
  phone: string;
  email: string | null;
  website: string | null;
  services: string;
  serviceArea: string | null;
  description: string | null;
  slug: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "page";
  const [biz, setBiz] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Check auth on page load
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

  const setTab = (t: string) => setSearchParams({ tab: t });

  const storefrontUrl = biz ? `${window.location.origin}/${biz.slug}` : "";

  const handleDownloadQR = () => {
    const svgEl = document.getElementById("qr-download-svg");
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${biz?.slug || "storefront"}-qr.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login", { replace: true });
    } catch {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-doorway-light flex items-center justify-center">
        <div className="text-doorway-gray">Loading...</div>
      </div>
    );
  }

  if (!biz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-doorway-light">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#1A7A7A"/>
              <path d="M8 24V16L24 8V16L8 24Z" fill="#F5A623" opacity="0.9"/>
              <path d="M10 22V17L22 11V16L10 22Z" fill="white" opacity="0.8"/>
            </svg>
            <span className="font-heading font-bold text-lg text-doorway-dark">Doorway</span>
            <span className="text-sm text-doorway-gray ml-2 hidden sm:inline">/ {biz.businessName}</span>
            <span className="bg-doorway-amber/10 text-doorway-amber text-xs font-bold px-2 py-0.5 rounded-full">Free Plan</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/${biz.slug}`} className="text-doorway-teal text-sm font-semibold hover:underline">
              View Your Page ↗
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm text-doorway-gray hover:text-red-600 font-medium transition-colors"
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl font-bold text-doorway-dark mb-6">Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          {[
            { id: "page", label: "Your Page" },
            { id: "qr", label: "QR Code" },
            { id: "analytics", label: "Analytics" },
            { id: "settings", label: "Settings" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? "text-doorway-teal border-doorway-teal"
                  : "text-doorway-gray border-transparent hover:text-doorway-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <>
          {tab === "page" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading text-lg font-bold text-doorway-dark mb-4">Your Live Page</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">Live at</span>
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-doorway-teal text-sm font-medium hover:underline"
                >
                  doorway.app/{biz.slug}
                </a>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-heading font-bold text-doorway-dark text-lg mb-1">{biz.businessName}</h3>
                {biz.serviceArea && <p className="text-sm text-doorway-gray mb-4">Serving {biz.serviceArea}</p>}
                {biz.description && <p className="text-doorway-gray text-sm mb-4">{biz.description}</p>}
                <p className="text-xs text-doorway-gray uppercase tracking-wider font-semibold mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {biz.services.split("\n").filter(Boolean).map((s, i) => (
                    <span key={i} className="bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-doorway-dark border border-gray-200">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-doorway-gray">📞 {biz.phone}</p>
                  {biz.email && <p className="text-sm text-doorway-gray mt-1">✉️ {biz.email}</p>}
                </div>
              </div>
            </div>
          )}

          {tab === "qr" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading text-lg font-bold text-doorway-dark mb-2">Your QR Code</h2>
              <p className="text-doorway-gray text-sm mb-6">
                Print this on your truck, uniform, flyers, and invoices. Every scan is a potential customer.
              </p>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm mb-6">
                  <QRCodeSVG id="qr-download-svg" value={storefrontUrl} size={200} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 bg-doorway-teal text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-doorway-teal-light transition-colors"
                  >
                    ⬇️ Download SVG
                  </button>
                  <a
                    href={`/api/storefronts/${biz?.slug}/qr.png`}
                    download
                    className="flex-1 bg-doorway-amber text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-doorway-amber-light transition-colors text-center"
                  >
                    ⬇️ Download PNG
                  </a>
                  <a
                    href={`/api/storefronts/${biz?.slug}/qr/pdf`}
                    download
                    className="flex-1 border-2 border-doorway-teal text-doorway-teal px-4 py-3 rounded-xl font-semibold text-sm hover:bg-doorway-teal/5 transition-colors text-center"
                  >
                    ⬇️ PDF — Truck Magnet
                  </a>
                </div>
                <div className="mt-6 bg-doorway-light rounded-xl p-4 w-full max-w-md">
                  <p className="text-xs font-semibold text-doorway-dark uppercase tracking-wider mb-2">Placement Tips</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-doorway-gray">
                    <span>🚛 Truck doors</span>
                    <span>🪟 Storefront windows</span>
                    <span>📄 Flyers</span>
                    <span>🧾 Invoices</span>
                    <span>💳 Business cards</span>
                    <span>🧰 Tool boxes</span>
                  </div>
                </div>
                <p className="text-xs text-doorway-gray mt-4 text-center">
                  Link: {storefrontUrl}
                </p>
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading text-lg font-bold text-doorway-dark mb-2">Analytics</h2>
              <p className="text-doorway-gray text-sm mb-6">
                Track how many people view your page.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Page Views", value: "—" },
                  { label: "QR Scans", value: "—" },
                  { label: "Calls", value: "—" },
                  { label: "Bookings", value: "—" },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-doorway-teal">{stat.value}</p>
                    <p className="text-sm text-doorway-gray mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-doorway-gray mt-6 text-center">
                Detailed analytics are available on the Premium plan ($19/mo).
              </p>
            </div>
          )}

          {tab === "settings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading text-lg font-bold text-doorway-dark mb-2">Settings</h2>
              <p className="text-doorway-gray text-sm mb-6">
                Update your storefront information.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-doorway-dark mb-1">Business Name</label>
                  <input
                    type="text"
                    defaultValue={biz.businessName}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-doorway-dark mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={biz.phone}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-doorway-teal"
                  />
                </div>
                <p className="text-xs text-doorway-gray">
                  Settings editing will be fully functional in the next update.
                </p>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}