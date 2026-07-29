import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  Store,
  QrCode,
  Wrench,
  Clock,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Sign up free",
    desc: "Enter your business name, phone, services, and area. Takes 30 seconds.",
  },
  {
    icon: Store,
    title: "Get your storefront",
    desc: "A professional mobile page with your services, contact info, and booking link.",
  },
  {
    icon: QrCode,
    title: "Download your QR code",
    desc: "Print it on your truck, uniform, flyers, and invoices. Customers scan and book.",
  },
];

const exampleBiz = {
  name: "River City Plumbing",
  rating: "4.9",
  reviews: "127",
  services: ["Drain Cleaning", "Pipe Repair", "Water Heater Install"],
  phone: "(555) 123-4567",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Trust signal bar */}
      <div className="bg-doorway-teal text-white py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Join 100+ local businesses already on Doorway — always free, always professional.
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#1A7A7A"/>
              <path d="M8 24V16L24 8V16L8 24Z" fill="#F5A623" opacity="0.9"/>
              <path d="M10 22V17L22 11V16L10 22Z" fill="white" opacity="0.8"/>
            </svg>
            <span className="font-heading font-bold text-xl text-doorway-dark">Doorway</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-doorway-gray text-sm font-medium hover:text-doorway-dark transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="bg-doorway-teal text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-doorway-teal-light transition-colors">
              Get Your Free Page
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-doorway-dark leading-tight">
          Your business card.
          <br />
          <span className="text-doorway-teal">Now a website.</span>
        </h1>
        <p className="mt-6 text-lg text-doorway-gray max-w-2xl mx-auto">
          A free, 30-second digital storefront for plumbers, electricians, cleaners,
          and landscapers. Looks professional. Gets you more calls. Zero effort.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="bg-doorway-teal text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-doorway-teal-light transition-colors shadow-lg shadow-doorway-teal/20 inline-flex items-center gap-2">
            Create Your Free Page
            <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="#how-it-works" className="border-2 border-gray-200 text-doorway-dark px-8 py-3.5 rounded-xl font-semibold text-lg hover:border-doorway-teal hover:text-doorway-teal transition-colors">
            How It Works
          </a>
        </div>

        {/* Hero demo QR */}
        <div className="mt-10 inline-flex items-center gap-4 bg-doorway-light rounded-2xl px-6 py-4 border border-gray-100">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <QRCodeSVG value="https://doorway.app/example" size={56} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-doorway-dark">See a live demo</p>
            <p className="text-xs text-doorway-gray">Scan this QR code with your phone</p>
          </div>
          <ChevronRight className="w-4 h-4 text-doorway-gray hidden sm:block" />
        </div>
      </section>

      {/* Example Storefront Card */}
      <section className="max-w-xs mx-auto mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-doorway-teal p-4 text-white text-center">
            <p className="text-xs uppercase tracking-wider opacity-80">Example Storefront</p>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-doorway-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-8 h-8 text-doorway-amber" />
            </div>
            <h3 className="font-heading font-bold text-xl text-doorway-dark">{exampleBiz.name}</h3>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-doorway-amber">★</span>
              <span className="font-semibold">{exampleBiz.rating}</span>
              <span className="text-doorway-gray text-sm">({exampleBiz.reviews} reviews)</span>
            </div>
            <div className="mt-4 space-y-2">
              {exampleBiz.services.map((s) => (
                <div key={s} className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-doorway-dark">
                  {s}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <div className="flex-1 bg-doorway-teal text-white rounded-lg py-2.5 text-sm font-semibold">
                Call Now
              </div>
              <div className="flex-1 border-2 border-doorway-teal text-doorway-teal rounded-lg py-2.5 text-sm font-semibold">
                Book Online
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-white">
                  <QRCodeSVG value="https://doorway.app/example" size={40} />
                </div>
                <span className="text-xs text-doorway-gray">Scan to see storefront</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 text-center text-xs text-doorway-gray">
            Powered by <span className="text-doorway-teal font-semibold">Doorway</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-doorway-light py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center text-doorway-dark mb-4">
            Get online in 30 seconds
          </h2>
          <p className="text-doorway-gray text-center mb-12 max-w-xl mx-auto">
            No tech skills. No monthly fees. Just a professional page that works.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-doorway-teal/10 rounded-xl mb-4">
                  <step.icon className="w-7 h-7 text-doorway-teal" />
                </div>
                <div className="bg-doorway-teal/10 text-doorway-teal text-sm font-bold rounded-full px-3 py-1 inline-block mb-3">
                  Step {i + 1}
                </div>
                <h3 className="font-heading font-bold text-xl text-doorway-dark mb-2">{step.title}</h3>
                <p className="text-doorway-gray">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center text-doorway-dark mb-12">
            Why every local business needs a Doorway
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-doorway-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-doorway-teal" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-doorway-dark">Looks professional</h3>
                <p className="text-doorway-gray mt-1">A modern, mobile-friendly page beats a Facebook link or no web presence at all.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-doorway-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-doorway-amber" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-doorway-dark">Takes 30 seconds</h3>
                <p className="text-doorway-gray mt-1">Just fill in your info. No tech skills, no designer, no hassle.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-doorway-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-doorway-teal" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-doorway-dark">Always free</h3>
                <p className="text-doorway-gray mt-1">Your basic storefront is always free. Upgrade for extra features when you're ready.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-doorway-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-doorway-amber" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-doorway-dark">Track your growth</h3>
                <p className="text-doorway-gray mt-1">See how many people scan your QR code and view your services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-doorway-light py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center text-doorway-dark mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is it really free?", a: "Yes! Your basic digital storefront is always free. Premium features like a custom domain and analytics are optional upgrades." },
              { q: "How do I get my QR code?", a: "Right after signup, you can download your QR code as PNG or PDF. Print it on your truck, uniform, flyers, and invoices." },
              { q: "Can I update my info later?", a: "Absolutely. Log into your dashboard anytime to update your services, hours, photos, and contact info." },
              { q: "What kind of businesses is this for?", a: "Plumbers, electricians, cleaners, landscapers, handymen, painters, movers — any local service business." },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 group">
                <summary className="font-heading font-bold text-doorway-dark cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-doorway-teal group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-doorway-gray">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-doorway-dark mb-4">
            Put your business on every phone in town
          </h2>
          <p className="text-doorway-gray mb-8">
            Your QR code on your truck is seen by hundreds of people every day. Make every glance a customer.
          </p>
          <Link to="/signup" className="bg-doorway-teal text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-doorway-teal-light transition-colors shadow-lg shadow-doorway-teal/20 inline-flex items-center gap-2">
            Create Your Free Page Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-doorway-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#1A7A7A"/>
              <path d="M8 24V16L24 8V16L8 24Z" fill="#F5A623" opacity="0.9"/>
              <path d="M10 22V17L22 11V16L10 22Z" fill="white" opacity="0.8"/>
            </svg>
            <span className="font-heading font-bold text-xl">Doorway</span>
          </div>
          <p className="text-gray-400 text-sm">Free digital storefronts for local service businesses.</p>
          <p className="text-gray-500 text-xs mt-4">© {new Date().getFullYear()} Doorway. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
