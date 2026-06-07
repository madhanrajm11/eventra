import api from '../api/axios.js'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export default function EditEvent() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        venue: '',
        capacity: '',
        registrationDeadline: '',
    })

    const [status, setStatus] = useState('')
    const [idCardUrl, setIdCardUrl] = useState('')
    const [permissionLetterUrl, setPermissionLetterUrl] = useState('')

    const [error, setError] = useState('')
    const [loadingEvent, setLoadingEvent] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notifyRegistrants, setNotifyRegistrants] = useState(false)

    const toDateTimeLocal = (backendDateTime) => {
        if (!backendDateTime) return ''
        return backendDateTime.slice(0, 16)
    }

    useEffect(() => {
        const fetchEvent = async () => {
            setLoadingEvent(true)
            setError('')

            try {
                const res = await api.get(`/events/${id}`)
                const e = res.data

                setStatus(e.status)

                if (e.status !== 'APPROVED') {
                    setError('You can only edit event that are Approved.')
                    return
                }

                setFormData({
                    title: e.title ?? '',
                    description: e.description ?? '',
                    venue: e.venue ?? '',
                    capacity: e.capacity != null ? String(e.capacity) : '',
                    eventDate: toDateTimeLocal(e.eventDate),
                    registrationDeadline: toDateTimeLocal(e.registrationDeadline),
                })

                setIdCardUrl(e.idCardUrl ?? '')
                setPermissionLetterUrl(e.permissionLetterUrl ?? '')
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load event details')
            } finally {
                setLoadingEvent(false)
            }
        }
        fetchEvent()
    }, [id])

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            await api.put(`/events/${id}`, {
                ...formData,
                idCardUrl,
                permissionLetterUrl,
                notifyRegistrants,
                capacity: parseInt(formData.capacity),
                eventDate: formData.eventDate ? formData.eventDate + ':00' : null,
                registrationDeadline: formData.registrationDeadline
                    ? formData.registrationDeadline + ':00'
                    : null,
            })

            navigate('/my-events')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event')
        } finally {
            setSaving(false)
        }
    }

    if (loadingEvent) {
        return <div className="text-center py-20 text-gray-500">Loading event...</div>
    }

    const canEdit = status === 'APPROVED'

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-blue-600">Edit Event</h1>
                    <Link to="/my-events" className="text-sm text-gray-500 hover:underline">
                        ← Back
                    </Link>
                </div>

                <p className="text-center text-gray-500 mb-6 text-sm">
                    Edit the event information.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm break-words">
                        {error}
                    </div>
                )}

                {!canEdit ? (
                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded text-sm break-words">
                        This event can't be edited in its current status.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Venue
                            </label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacity
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Registration Deadline
                            </label>
                            <input
                                type="datetime-local"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-orange-700 mb-4">
                            <input
                                type="checkbox"
                                checked={notifyRegistrants}
                                onChange={(e) => setNotifyRegistrants(e.target.checked)}
                            />
                            Notify registered users about this update
                        </label>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}