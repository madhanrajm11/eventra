import api from '../api/axios.js'
import { useEffect, useState } from "react"

export default function PendingEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [rejectModel, setRejectModel] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        let active = true

        const fetchPending = async () => {
            try {
                const res = await api.get(`/admin/events/pending`)
                if (active) setEvents(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchPending()

        return () => {
            active = false
        }
    }, [])

    const handleApprove = async (id) => {
        setActionLoading(id + '-approve')
        try {
            await api.put(`/admin/events/${id}/approve`)
            setMessage('✅ Event approved successfully')
            setEvents(prev => prev.filter(e => Number(e.id) !== Number(id)))
        } catch (err) {
            setMessage('❌' + (err.response?.data?.message || 'Failed to approve'))
        } finally {
            setActionLoading(null)
        }
    }

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) return
        setActionLoading(rejectModel + '-reject')
        try {
            await api.put(`/admin/events/${rejectModel}/reject`, {
                reason: rejectReason
            })
            setMessage('🚫 Event rejected')
            setEvents(prev => prev.filter(e => Number(e.id) !== Number(rejectModel)))
            setRejectModel(null)
            setRejectReason('')
        } catch (err) {
            setMessage('❌' + (err.response?.data?.message || 'Failed to reject'))
        } finally {
            setActionLoading(null)
        }
    }

    const fomatData = (dateStr) => {
        if (!dateStr) return 'N/A'
        return new Date(dateStr + 'Z').toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
    }

    if (loading) return (
        <div className="text-center py-20 text-gray-500">Loading pending events...</div>
    )

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pending Approval</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review and approve or reject event submission
                    </p>
                </div>
                <span className="self-start sm:self-auto bg-yellow-100 text-yellow-700 text-sm font-medium px-4 py-2 rounded-full">
          {events.length} pending
        </span>
            </div>

            {message && (
                <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium break-words">
                    {message}
                </div>
            )}

            {events.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-5xl mb-4">🎉</p>
                    <p className="text-xl font-medium">All caught up</p>
                    <p className="text-sm mt-1">No events waiting for approval.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-4 sm:px-6 py-5">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-bold text-gray-800 break-words">{event.title}</h2>
                                        <p className="text-sm text-gray-500 mt-1 break-words">
                                            Submitted by <span className="font-medium text-gray-700">{event.organizerName}</span>
                                        </p>
                                    </div>
                                    <span className="self-start sm:self-auto bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                    ⏳ Pending
                  </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 break-words">{event.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-400 mb-1">Date</p>
                                        <p className="text-sm font-medium text-gray-700 break-words">
                                            {fomatData(event.eventDate)}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-400 mb-1">Venue</p>
                                        <p className="text-sm font-medium text-gray-700 break-words">{event.venue}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-400 mb-1">Capacity</p>
                                        <p className="text-sm font-medium text-gray-700 break-words">{event.capacity} Seats</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-400 mb-1">Deadline</p>
                                        <p className="text-sm font-medium text-gray-700 break-words">
                                            {fomatData(event.registrationDeadline)}
                                        </p>
                                    </div>
                                </div>

                                {(event.idCardUrl || event.permissionLetterUrl) && (
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-5">
                                        {event.idCardUrl && (
                                            <a
                                                href={event.idCardUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-blue-600 hover:underline break-words"
                                            >
                                                🪪 View ID Card
                                            </a>
                                        )}
                                        {event.permissionLetterUrl && (
                                            <a
                                                href={event.permissionLetterUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-blue-600 hover:underline break-words"
                                            >
                                                📄 View Permission Letter
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleApprove(event.id)}
                                        disabled={actionLoading !== null}
                                        className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {actionLoading === event.id + '-approve' ? 'Approving...' : '✅ Approve'}
                                    </button>

                                    <button
                                        onClick={() => { setRejectModel(event.id); setRejectReason('') }}
                                        disabled={actionLoading !== null}
                                        className="w-full sm:w-auto bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50"
                                    >
                                        🚫 Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {rejectModel && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Reject Event</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please provide a reason. The organizer will see this message.
                        </p>
                        <textarea
                            rows={4}
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="e.g. Missing required documents, venue not available..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                        />
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <button
                                onClick={handleRejectConfirm}
                                disabled={!rejectReason.trim() || actionLoading !== null}
                                className="w-full sm:flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                            </button>

                            <button
                                onClick={() => setRejectModel(null)}
                                className="w-full sm:flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
