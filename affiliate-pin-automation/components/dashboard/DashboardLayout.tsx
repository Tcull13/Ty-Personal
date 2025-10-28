'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Pins', href: '/dashboard/pins', icon: '📌' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-purple-600">
              PinAutomate
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Plan: </span>
                <span className="font-semibold text-purple-600 capitalize">
                  {session?.user?.planTier || 'Free'}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Upgrade CTA */}
              {session?.user?.planTier === 'free' && (
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">
                    Upgrade to Pro
                  </p>
                  <p className="text-xs text-purple-700 mb-3">
                    Get unlimited pins and advanced features
                  </p>
                  <Link
                    href="/dashboard/settings"
                    className="block text-center bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
