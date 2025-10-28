'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LinkSubmissionForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [pinStyle, setPinStyle] = useState('auto')
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/links/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          pinStyle,
          customText: customText || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.upgrade) {
          setError(data.error + ' Please upgrade your plan.')
        } else {
          setError(data.error || 'Failed to create pin')
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      setUrl('')
      setCustomText('')

      // Refresh the page to show new pin
      setTimeout(() => {
        router.refresh()
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          Pin generated successfully! It will appear below shortly.
        </div>
      )}

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Amazon Affiliate Link
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://www.amazon.com/dp/..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste any Amazon product URL
        </p>
      </div>

      <div>
        <label htmlFor="pinStyle" className="block text-sm font-medium text-gray-700 mb-2">
          Pin Style
        </label>
        <select
          id="pinStyle"
          value={pinStyle}
          onChange={(e) => setPinStyle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="auto">Auto (Recommended)</option>
          <option value="minimal">Minimal</option>
          <option value="bold">Bold</option>
          <option value="elegant">Elegant</option>
        </select>
      </div>

      <div>
        <label htmlFor="customText" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Description (Optional)
        </label>
        <textarea
          id="customText"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          rows={3}
          placeholder="Leave blank for AI-generated description"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating Pin... (this may take 30 seconds)' : 'Generate Pin'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        AI will scrape product info, generate an image, and create compelling copy
      </p>
    </form>
  )
}
