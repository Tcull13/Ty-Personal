import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">PinAutomate</div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Turn Amazon Links Into
          <span className="text-purple-600"> Pinterest Gold</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Paste your Amazon affiliate link, and we'll create stunning Pinterest
          pins and post them automatically. Sit back while your passive income
          grows.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition shadow-lg"
          >
            Start Free Trial
          </Link>
          <Link
            href="#pricing"
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition border-2 border-purple-600"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Paste Your Link</h3>
            <p className="text-gray-600">
              Simply paste any Amazon affiliate link into our dashboard.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. AI Creates Pins</h3>
            <p className="text-gray-600">
              Our AI generates beautiful, engaging Pinterest pins
              automatically.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📌</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Auto-Post</h3>
            <p className="text-gray-600">
              Pins are posted to Pinterest automatically based on your schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-purple-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why PinAutomate?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="text-2xl">⏰</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                <p className="text-gray-600">
                  No more manually creating pins in Canva or scheduling posts.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🎨</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Professional Design
                </h3>
                <p className="text-gray-600">
                  AI-generated pins that look professionally designed.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">📈</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Increase Traffic</h3>
                <p className="text-gray-600">
                  Consistent posting leads to more clicks and conversions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🤖</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Set & Forget</h3>
                <p className="text-gray-600">
                  Configure once, and let automation do the work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-gray-600 mb-16">
          Start free, upgrade as you grow
        </p>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-4">
              $0<span className="text-lg text-gray-600">/mo</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>3 pins/day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>1 board</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic pin generation</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="block text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Basic Plan */}
          <div className="border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <p className="text-4xl font-bold mb-4">
              $19<span className="text-lg text-gray-600">/mo</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>20 pins/day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>5 boards</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI pin generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Auto-posting</span>
              </li>
            </ul>
            <Link
              href="/signup?plan=basic"
              className="block text-center bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
            >
              Start Trial
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-purple-600 rounded-2xl p-6 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-4">
              $49<span className="text-lg text-gray-600">/mo</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>100 pins/day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>20 boards</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced AI</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Analytics</span>
              </li>
            </ul>
            <Link
              href="/signup?plan=pro"
              className="block text-center bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
            >
              Start Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-4xl font-bold mb-4">
              $199<span className="text-lg text-gray-600">/mo</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>500 pins/day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited boards</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>API access</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dedicated support</span>
              </li>
            </ul>
            <Link
              href="/signup?plan=enterprise"
              className="block text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition"
            >
              Start Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Automate Your Affiliate Income?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of affiliate marketers already using PinAutomate
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2025 PinAutomate. All rights reserved.</p>
      </footer>
    </div>
  )
}
