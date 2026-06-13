import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic AI art generation",
      "5 free templates",
      "Standard exports (720p)",
      "Community access",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious storytellers",
    features: [
      "Unlimited AI art generation",
      "50+ premium templates",
      "Unlimited high-res exports (4K)",
      "Collaborative editing (up to 5)",
      "Priority support",
      "Exclusive styles & assets",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Print",
    price: "Pay as",
    period: "you go",
    description: "Add physical copies to any plan",
    features: [
      "Premium quality printing",
      "Multiple binding options",
      "Global shipping",
      "Bulk order discounts",
      "Author copies",
    ],
    cta: "Learn More",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibe-purple via-vibe-pink to-vibe-cyan flex items-center justify-center">
              <svg
                width="18"
                height="18"
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
            <span className="font-display font-bold text-lg">VibeScapes</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h1>
          <p className="text-muted text-lg max-w-lg mx-auto">
            Start for free. Upgrade when you&apos;re ready to take your visual
            storytelling to the next level.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl border transition-all ${
                plan.featured
                  ? "bg-gradient-to-b from-vibe-purple/10 to-transparent border-vibe-purple/20"
                  : "bg-surface border-white/[0.06] hover:border-white/10"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-vibe-purple to-vibe-pink text-xs font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-display font-semibold text-lg mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="font-display text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted text-sm">{plan.period}</span>
                </div>
                <p className="text-muted text-sm mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-4 h-4 mt-0.5 text-vibe-cyan shrink-0"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M13.3 4.3L6 11.6 2.7 8.3" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-3 rounded-full font-medium text-sm transition-all ${
                  plan.featured
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}