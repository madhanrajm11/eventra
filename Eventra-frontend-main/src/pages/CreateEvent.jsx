import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from '../api/axios.js'
import { uploadFile } from "../api/cloudinary.js"

const getApiErrorMessage = (err, fallback) => {
    if (err.response?.data?.message) return err.response.data.message
    if (err.request && !err.response) {
        return 'Cannot connect to the backend server. Make sure Spring Boot is running on http://localhost:8080.'
    }
    return err.message || fallback
}

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        venue: '',
        capacity: '',
        registrationDeadline: '',
    })

    const [idCardUrl, setIdCardUrl] = useState('')
    const [permissionLetterUrl, setPermissionLetterUrl] = useState('')
    const [idCardUploading, setIdCardUploading] = useState(false)
    const [permissionLetterUploading, setPermissionLetterUploading] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        const allowed = ['image/jpeg', 'image/png', 'application/pdf']
        if (!allowed.includes(file.type)) {
            setError('Only JPG, PNG or PDF files are allowed.')
            e.target.value = ''
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be under 5MB')
            e.target.value = ''
            return
        }

        setError('')

        try {
            if (type === 'idCard') {
                setIdCardUploading(true)
                const url = await uploadFile(file)
                setIdCardUrl(url)
            } else {
                setPermissionLetterUploading(true)
                const url = await uploadFile(file)
                setPermissionLetterUrl(url)
            }
        } catch (err) {
            setError(getApiErrorMessage(err, 'File upload failed. Please try again'))
        } finally {
            setIdCardUploading(false)
            setPermissionLetterUploading(false)
            e.target.value = ''
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!idCardUrl && !permissionLetterUrl) {
            setError('Please provide at least one verification document URL.')
            return
        }

        setLoading(true)
        try {
            await api.post(`/events`, {
                ...formData,
                idCardUrl,
                permissionLetterUrl,
                capacity: parseInt(formData.capacity, 10),
                eventDate: formData.eventDate ? formData.eventDate + ':00' : null,
                registrationDeadline: formData.registrationDeadline ? formData.registrationDeadline + ':00' : null
            })
            setSubmitted(true)
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to create event'))
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setSubmitted(false)
        setFormData({
            title: '',
            description: '',
            eventDate: '',
            venue: '',
            capacity: '',
            registrationDeadline: '',
        })
        setIdCardUrl('')
        setPermissionLetterUrl('')
    }

    if (submitted) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Submitted!</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Your event has been submitted for admin review. You'll be notified once it's approved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate(`/my-events`)}
                        className="w-full sm:flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                        View My Events
                    </button>
                    <button
                        onClick={resetForm}
                        className="w-full sm:flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-50"
                    >
                        Create Another
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
                    Create Event
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Submit your event for admin approval
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm break-words">
                        {error}
                    </div>
                )}

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
                            placeholder="e.g. Annual Tech Symposium"
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
                            placeholder="Describe what the event is about..."
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
                            placeholder="e.g. Auditorium Block A"
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
                            placeholder="e.g. 100"
                            min="1"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="min-w-0">
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

                        <div className="min-w-0">
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
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Verification Documents
                            <span className="text-red-500 ml-1">*</span>
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                            Upload at least one document. Accepted: JPG, PNG, PDF (max 5MB each).
                        </p>

                        <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">ID Card</label>
                            {idCardUrl ? (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                                    <span className="text-green-700 text-xs flex-1 break-words">Upload successful</span>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={idCardUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 text-xs hover:underline"
                                        >
                                            View
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setIdCardUrl('')}
                                            className="text-red-500 text-xs hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 cursor-pointer transition text-center ${idCardUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
                                    <input
                                        type="file"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'idCard')}
                                        disabled={idCardUploading}
                                    />
                                    {idCardUploading ? (
                                        <span className="text-blue-600 text-sm">Uploading...</span>
                                    ) : (
                                        <span className="text-gray-600 text-sm">Click to upload ID Card</span>
                                    )}
                                </label>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">Permission Letter</label>
                            {permissionLetterUrl ? (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                                    <span className="text-green-700 text-xs flex-1 break-words">Upload successful</span>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={permissionLetterUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 text-xs hover:underline"
                                        >
                                            View
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setPermissionLetterUrl('')}
                                            className="text-red-500 text-xs hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 cursor-pointer transition text-center ${permissionLetterUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
                                    <input
                                        type="file"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'permission')}
                                        disabled={permissionLetterUploading}
                                    />
                                    {permissionLetterUploading ? (
                                        <span className="text-blue-600 text-sm">Uploading...</span>
                                    ) : (
                                        <span className="text-gray-600 text-sm">Click to upload Permission Letter</span>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || idCardUploading || permissionLetterUploading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                </form>
            </div>
        </div>
    )
}
