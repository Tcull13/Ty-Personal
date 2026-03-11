'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SettingsContent() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const [pinterestConnected, setPinterestConnected] = useState(false)
  const [autoPostEnabled, setAutoPostEnabled] = useState(false)
  const [postingFrequency, setPostingFrequency] = useState(3)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/user/settings')
      if (res.ok) {
        const data = await res.json()
        setPinterestConnected(data.pinterestConnected)
        setAutoPostEnabled(data.autoPostEnabled)
        setPostingFrequency(data.postingFrequency)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleConnectPinterest = () => {
    const redirectUri = `${window.location.origin}/api/auth/pinterest/callback`
    const appId = process.env.NEXT_PUBLIC_PINTEREST_APP_ID || ''
    const scope = 'boards:read,pins:read,pins:write'
    const state = Math.random().toString(36).substring(7)

    window.location.href = `https://www.pinterest.com/oauth/?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}`
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPostEnabled, postingFrequency }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planTier: plan }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      alert('Failed to start checkout')
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      alert('Failed to open billing portal')
      setLoading(false)
    }
  }

  const currentPlan = session?.user?.planTier || 'free'
  const isPaidPlan = currentPlan !== 'free'

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-600">Name:</span>{' '}
            <span className="font-semibold">{session?.user?.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>{' '}
            <span className="font-semibold">{session?.user?.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Current Plan:</span>{' '}
            <span className="font-semibold capitalize text-purple-600">
              {currentPlan}
            </span>
          </div>
        </div>
      </div>

      {/* Pinterest Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Pinterest Integration</h2>

        {settingsLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
            Loading...
          </div>
        ) : pinterestConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-xl">✅</span>
              <span className="font-semibold">Pinterest account connected</span>
            </div>
            <button
              onClick={handleConnectPinterest}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Reconnect with different account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">
              Connect your Pinterest account to enable auto-posting
            </p>
            <button
              onClick={handleConnectPinterest}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              Connect Pinterest Account
            </button>
            {!process.env.NEXT_PUBLIC_PINTEREST_APP_ID && (
              <p className="text-sm text-amber-600">
                Note: Pinterest App ID not configured. Add NEXT_PUBLIC_PINTEREST_APP_ID to your environment variables.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Posting Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Posting Settings</h2>
        <div className="space-y-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setAutoPostEnabled(!autoPostEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoPostEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  autoPostEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
            <div>
              <span className="font-medium">Enable auto-posting</span>
              <p className="text-sm text-gray-500">
                Automatically post pins to Pinterest on a schedule
              </p>
            </div>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posting Frequency
            </label>
            <select
              value={postingFrequency}
              onChange={(e) => setPostingFrequency(Number(e.target.value))}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1 pin per day</option>
              <option value={3}>3 pins per day</option>
              <option value={5}>5 pins per day</option>
              <option value={10}>10 pins per day</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && (
              <span className="text-green-600 font-medium">Settings saved!</span>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>

        {!isPaidPlan ? (
          <div>
            <p className="text-gray-600 mb-4">
              Upgrade to unlock more pins per day and advanced features
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Basic</h3>
                <p className="text-3xl font-bold mb-2">$19<span className="text-sm">/mo</span></p>
                <p className="text-sm text-gray-600 mb-4">20 pins/day</p>
                <button
                  onClick={() => handleUpgrade('basic')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Upgrade
                </button>
              </div>

              <div className="border-2 border-purple-600 rounded-lg p-4">
                <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full w-fit mb-2">
                  Popular
                </div>
                <h3 className="font-semibold text-lg mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-2">$49<span className="text-sm">/mo</span></p>
                <p className="text-sm text-gray-600 mb-4">100 pins/day</p>
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Upgrade
                </button>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-2">$199<span className="text-sm">/mo</span></p>
                <p className="text-sm text-gray-600 mb-4">500 pins/day</p>
                <button
                  onClick={() => handleUpgrade('enterprise')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              You're currently on the <span className="font-semibold capitalize">{currentPlan}</span> plan
            </p>
            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50"
            >
              Manage Subscription
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Cancel, upgrade, or view billing history
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
