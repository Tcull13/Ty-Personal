'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Pin {
  id: string
  title: string
  description: string
  imageUrl: string
  destinationUrl: string
  status: string
  createdAt: string
  postedAt?: string
  pinterestPinId?: string
}

interface PinterestBoard {
  id: string
  name: string
}

export default function PinGallery() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [postingPin, setPostingPin] = useState<string | null>(null)

  // Board selection modal state
  const [showBoardModal, setShowBoardModal] = useState(false)
  const [pendingPinId, setPendingPinId] = useState<string | null>(null)
  const [boards, setBoards] = useState<PinterestBoard[]>([])
  const [boardsLoading, setBoardsLoading] = useState(false)
  const [boardsError, setBoardsError] = useState('')
  const [selectedBoardId, setSelectedBoardId] = useState('')

  useEffect(() => {
    fetchPins()
  }, [])

  const fetchPins = async () => {
    try {
      const res = await fetch('/api/pins/list')
      if (res.ok) {
        const data = await res.json()
        setPins(data.pins || [])
      }
    } catch (err) {
      console.error('Failed to fetch pins:', err)
    } finally {
      setLoading(false)
    }
  }

  const openBoardModal = async (pinId: string) => {
    setPendingPinId(pinId)
    setSelectedBoardId('')
    setBoardsError('')
    setShowBoardModal(true)
    setBoardsLoading(true)

    try {
      const res = await fetch('/api/pinterest/boards')
      if (res.ok) {
        const data = await res.json()
        setBoards(data.boards || [])
      } else {
        const data = await res.json()
        setBoardsError(data.error || 'Failed to load boards')
      }
    } catch {
      setBoardsError('Failed to load Pinterest boards')
    } finally {
      setBoardsLoading(false)
    }
  }

  const handlePostPin = async () => {
    if (!pendingPinId || !selectedBoardId) return

    setShowBoardModal(false)
    setPostingPin(pendingPinId)

    try {
      const res = await fetch('/api/pins/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinId: pendingPinId, boardId: selectedBoardId }),
      })

      if (res.ok) {
        fetchPins()
        setSelectedPin(null)
      } else {
        const data = await res.json()
        alert('Failed to post: ' + (data.error || 'Unknown error'))
      }
    } catch {
      alert('Failed to post pin')
    } finally {
      setPostingPin(null)
      setPendingPinId(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading pins...</p>
      </div>
    )
  }

  if (pins.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📌</div>
        <h3 className="text-xl font-semibold mb-2">No pins yet</h3>
        <p className="text-gray-600">
          Create your first pin by pasting an Amazon affiliate link above
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedPin(pin)}
          >
            <div className="relative h-64 bg-gray-200">
              {pin.imageUrl ? (
                <Image
                  src={pin.imageUrl}
                  alt={pin.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-4xl">🖼️</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {pin.title}
              </h3>

              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    pin.status === 'posted'
                      ? 'bg-green-100 text-green-700'
                      : pin.status === 'draft'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {pin.status}
                </span>

                {pin.status === 'draft' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openBoardModal(pin.id)
                    }}
                    disabled={postingPin === pin.id}
                    className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {postingPin === pin.id ? 'Posting...' : 'Post'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pin Detail Modal */}
      {selectedPin && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPin(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedPin.title}</h2>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedPin.imageUrl && (
                <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedPin.imageUrl}
                    alt={selectedPin.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-gray-700">{selectedPin.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Destination URL</h3>
                  <a
                    href={selectedPin.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline break-all text-sm"
                  >
                    {selectedPin.destinationUrl}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <span
                    className={`inline-block text-sm px-3 py-1 rounded-full ${
                      selectedPin.status === 'posted'
                        ? 'bg-green-100 text-green-700'
                        : selectedPin.status === 'draft'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {selectedPin.status}
                  </span>
                </div>

                {selectedPin.status === 'draft' && (
                  <button
                    onClick={() => openBoardModal(selectedPin.id)}
                    disabled={postingPin === selectedPin.id}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {postingPin === selectedPin.id ? 'Posting to Pinterest...' : 'Post to Pinterest'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Board Selection Modal */}
      {showBoardModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          onClick={() => setShowBoardModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Select Pinterest Board</h3>
              <button
                onClick={() => setShowBoardModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {boardsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your boards...</p>
              </div>
            ) : boardsError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{boardsError}</p>
                {boardsError.includes('connect') && (
                  <a
                    href="/dashboard/settings"
                    className="text-purple-600 hover:underline"
                  >
                    Go to Settings to connect Pinterest
                  </a>
                )}
              </div>
            ) : boards.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No boards found. Create a board on Pinterest first.
              </p>
            ) : (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {boards.map((board) => (
                    <label
                      key={board.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                        selectedBoardId === board.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="board"
                        value={board.id}
                        checked={selectedBoardId === board.id}
                        onChange={() => setSelectedBoardId(board.id)}
                        className="accent-purple-600"
                      />
                      <span className="font-medium">{board.name}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handlePostPin}
                  disabled={!selectedBoardId}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post to Pinterest
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
