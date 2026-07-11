import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
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

function trackScan(slug: string, type: "view" | "scan" | "call_click") {
  fetch(`/api/storefronts/${slug}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  }).catch(() => {}); // Fire-and-forget
}

export default function StorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const [biz, setBiz] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackedView, setTrackedView] = useState(false);

  // Track page view on mount (once)
  useEffect(() => {
    if (!slug || trackedView) return;
    setTrackedView(true);
    trackScan(slug, "view");
  }, [slug, trackedView]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/storefronts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Storefront not found");
        return res.json();
      })
      .then((data) => setBiz(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCall = useCallback(() => {
    if (biz?.slug) {
      trackScan(biz.slug, "call_click");
    }
  }, [biz?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-doorway-gray">Loading...</div>
      </div>
    );
  }

  if (error || !biz) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="font-heading text-2xl font-bold text-doorway-dark mb-2">Storefront Not Found</h1>
        <p className="text-doorway-gray mb-6">{error || "This page doesn't exist."}</p>
        <Link to="/" className="text-doorway-teal font-semibold hover:underline">Go Home</Link>
      </div>
    );
  }

  const servicesList = biz.services.split("\n").filter(Boolean);
  const storefrontUrl = `${window.location.origin}/${biz.slug}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Mobile card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-doorway-teal px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">{biz.businessName}</h1>
          {biz.serviceArea && (
            <p className="text-white/80 text-sm mt-1">Serving {biz.serviceArea}</p>
          )}
        </div>

        {/* Description */}
        {biz.description && (
          <div className="px-6 pt-6">
            <p className="text-doorway-gray text-sm">{biz.description}</p>
          </div>
        )}

        {/* Services */}
        <div className="px-6 pt-6">
          <h2 className="font-heading font-bold text-doorway-dark text-sm uppercase tracking-wider mb-3">Services</h2>
          <div className="space-y-2">
            {servicesList.map((service, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-doorway-dark font-medium text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-doorway-teal rounded-full flex-shrink-0" />
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Contact/Booking Buttons */}
        <div className="px-6 pt-6 pb-4 space-y-3">
          <a
            href={`tel:${biz.phone}`}
            onClick={handleCall}
            className="block w-full bg-doorway-teal text-white text-center py-3.5 rounded-xl font-bold hover:bg-doorway-teal-light transition-colors"
          >
            📞 Call {biz.phone}
          </a>
          {biz.website && (
            <a
              href={biz.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border-2 border-doorway-teal text-doorway-teal text-center py-3 rounded-xl font-semibold hover:bg-doorway-teal/5 transition-colors"
            >
              📅 Book Online
            </a>
          )}
          {biz.email && (
            <a
              href={`mailto:${biz.email}`}
              className="block w-full border-2 border-gray-200 text-doorway-dark text-center py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors"
            >
              ✉️ Email Us
            </a>
          )}
        </div>

        {/* QR Code */}
        <div className="px-6 pb-6">
          <details className="group">
            <summary className="text-sm text-doorway-gray cursor-pointer list-none flex items-center justify-center gap-1 hover:text-doorway-teal transition-colors">
              <span>🔳 Scan this page's QR code</span>
              <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 flex justify-center">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <QRCodeSVG value={storefrontUrl} size={120} />
              </div>
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-doorway-gray">
            Powered by{" "}
            <Link to="/" className="text-doorway-teal font-semibold hover:underline">Doorway</Link>
          </p>
        </div>
      </div>
    </div>
  );
}