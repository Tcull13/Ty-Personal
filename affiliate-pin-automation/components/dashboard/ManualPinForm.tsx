'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ManualPinForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    affiliateUrl: '',
    productTitle: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/pins/create-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        affiliateUrl: '',
        productTitle: '',
      })

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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">✍️</span>
        <div>
          <h3 className="font-semibold text-blue-900">Manual Pin Entry (Bootstrap Mode)</h3>
          <p className="text-sm text-blue-700">
            Create pins without AI - perfect for starting with $0 investment!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            Pin created successfully! It will appear in your gallery below.
          </div>
        )}

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Pin Image URL *
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            placeholder="https://i.imgur.com/your-pin-image.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Create pin in Canva → Upload to Imgur.com → Paste URL here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Pin Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Amazing Product You'll Love!"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="productTitle"
              name="productTitle"
              type="text"
              value={formData.productTitle}
              onChange={handleChange}
              placeholder="Product Name from Amazon"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Pin Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            maxLength={500}
            placeholder="Write compelling description with call-to-action and hashtags #AmazonFinds #MustHave"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div>
          <label htmlFor="affiliateUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Amazon Affiliate Link *
          </label>
          <input
            id="affiliateUrl"
            name="affiliateUrl"
            type="url"
            value={formData.affiliateUrl}
            onChange={handleChange}
            required
            placeholder="https://www.amazon.com/dp/B08N5WRWNW?tag=your-tag-20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Make sure your affiliate tag is in the URL
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Pin...' : '✅ Create Pin (Free!)'}
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          <p className="font-semibold mb-1">💡 Free Workflow:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create pin design in Canva (free)</li>
            <li>Download as PNG</li>
            <li>Upload to Imgur.com (free)</li>
            <li>Copy image URL</li>
            <li>Paste here + add title/description</li>
            <li>Post to Pinterest manually</li>
            <li>Start earning! 💰</li>
          </ol>
        </div>
      </form>
    </div>
  )
}
