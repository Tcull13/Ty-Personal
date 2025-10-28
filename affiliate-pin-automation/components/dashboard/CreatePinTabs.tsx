'use client'

import { useState } from 'react'
import LinkSubmissionForm from './LinkSubmissionForm'
import ManualPinForm from './ManualPinForm'

export default function CreatePinTabs() {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
            activeTab === 'manual'
              ? 'bg-white text-purple-600 border-b-2 border-purple-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>✍️</span>
            <span>Manual Entry</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              FREE
            </span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
            activeTab === 'ai'
              ? 'bg-white text-purple-600 border-b-2 border-purple-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>✨</span>
            <span>AI Generation</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              ~$0.05/pin
            </span>
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'manual' ? (
          <div>
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-yellow-900 mb-1">
                💡 Bootstrap Mode - Start Earning with $0 Investment!
              </p>
              <p className="text-yellow-800">
                Create pins in Canva (free), paste the image URL here, and start earning affiliate commissions.
                Once profitable, upgrade to AI for 20x faster pin creation!
              </p>
            </div>
            <ManualPinForm />
          </div>
        ) : (
          <div>
            <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-purple-900 mb-1">
                🤖 AI-Powered Pin Generation
              </p>
              <p className="text-purple-800">
                Paste an Amazon link and AI will scrape the product, generate a stunning image,
                and write compelling copy. Costs ~$0.05 per pin (requires OpenAI API key).
              </p>
            </div>
            <LinkSubmissionForm />
          </div>
        )}
      </div>
    </div>
  )
}
