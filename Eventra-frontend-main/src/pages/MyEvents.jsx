import api from '../api/axios.js'
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function MyEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [message, setMessage] = useState('')
    const [tab, setTab] = useState('APPROVED')

    const fetchMyEvents = () => {
        api.get(`/events/my`)
            .then(res => setEvents(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchMyEvents()
    }, [])

    const filteredEvents =
        tab === 'ALL' ? events : events.filter(e => e.status === tab)

    const STATUS_TABS = [
        { key: 'APPROVED', label: 'Active' },
        { key: 'PENDING_APPROVAL', label: 'Pending' },
        { key: 'REJECTED', label: 'Rejected' },
        { key: 'CANCELLED', label: 'Cancelled' },
        { key: 'ALL', label: 'All' },
    ]

    const tabClass = (active) =>
        `px-3 sm:px-4 py-2 rounded-md text-sm font-medium border transition whitespace-nowrap ${
            active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
        }`

    if (loading) return (
        <div className="text-center py-20 text-gray-500">Loading your events...</div>
    )

    if (events.length === 0) return (
        <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-xl font-medium mb-2">No events yet</p>
            <Link to="/create-event" className="text-blue-600 hover:underline text-sm">
                Create your first event →
            </Link>
        </div>
    )

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this event?')) return
        setCancellingId(id)

        try {
            await api.delete(`/events/${id}`)
            setMessage('Event cancelled successfully.')
            setEvents(prev => prev.map(e =>
                e.id === id ? { ...e, status: 'CANCELLED' } : e
            ))
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to cancel event.')
        } finally {
            setCancellingId(null)
        }
    }

    const statusStyles = {
        APPROVED: "bg-green-100 text-green-700",
        PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
        REJECTED: "bg-red-100 text-red-700",
        CANCELLED: "bg-gray-100 text-gray-600",
    }

    const statusLabels = {
        APPROVED: "✅ Approved",
        PENDING_APPROVAL: "⏳ Pending Approval",
        REJECTED: "🚫 Rejected",
        CANCELLED: "❌ Cancelled",
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Events</h1>
                <Link
                    to="/create-event"
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 text-center"
                >
                    + Create Event
                </Link>
            </div>

            <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
                <div className="flex gap-2 w-max">
                    {STATUS_TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={tabClass(tab === t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {message && (
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div className="min-w-0">
                                <h2 className="text-xl font-bold text-gray-800 break-words">{event.title}</h2>
                                <p className="text-sm text-gray-500 mt-1 break-words">
                                    📅 {new Date(event.eventDate).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })} · 📍 {event.venue}
                                </p>
                            </div>
                            <span className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-medium ${statusStyles[event.status]}`}>
                {statusLabels[event.status]}
              </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 break-words">{event.description}</p>

                        {event.status === 'REJECTED' && event.rejectionReason && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 break-words">
                                <span className="font-medium">Rejection reason: </span>
                                {event.rejectionReason}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                            {event.status === 'APPROVED' && (
                                <Link
                                    to={`/scan-qr?eventId=${event.id}`}
                                    className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 h-10"
                                >
                                    📷 Scan QR / Attendance
                                </Link>
                            )}

                            <Link
                                to={`/events/${event.id}`}
                                className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 h-10"
                            >
                                View Details
                            </Link>

                            {event.status === 'APPROVED' && (
                                <Link
                                    to={`/events/${event.id}/edit`}
                                    className="w-full sm:w-auto inline-flex items-center justify-center border border-blue-200 text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-blue-50 h-10"
                                >
                                    ✏️ Edit
                                </Link>
                            )}

                            {(event.status === 'APPROVED' || event.status === 'PENDING_APPROVAL') && (
                                <button
                                    onClick={() => handleCancel(event.id)}
                                    disabled={cancellingId === event.id}
                                    className="w-full sm:w-auto inline-flex items-center justify-center border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50 disabled:opacity-50 h-10"
                                >
                                    {cancellingId === event.id ? 'Cancelling...' : 'Cancel Event'}
                                </button>
                            )}

                            {event.status === 'PENDING_APPROVAL' && (
                                <p className="text-yellow-600 text-sm w-full">
                                    ⏳ Your event is under review. Admin will approve it shortly.
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}