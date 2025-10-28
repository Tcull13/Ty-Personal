'use client'

import { useEffect, useState } from 'react'

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalPins: 0,
    postedPins: 0,
    todayPins: 0,
    dailyLimit: 3,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const remainingToday = Math.max(0, stats.dailyLimit - stats.todayPins)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Pins</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.totalPins}
            </p>
          </div>
          <div className="text-4xl">📌</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Posted</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {stats.postedPins}
            </p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Today</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {stats.todayPins}
            </p>
          </div>
          <div className="text-4xl">📅</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Remaining Today</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {remainingToday}
            </p>
          </div>
          <div className="text-4xl">🎯</div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{
                width: `${(stats.todayPins / stats.dailyLimit) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
