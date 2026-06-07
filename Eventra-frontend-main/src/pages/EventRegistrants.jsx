import api from '../api/axios.js'
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export default function EventRegistrants() {
    const { id: eventId } = useParams()

    const [registrants, setRegistrants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [eventTitle, setEventTitle] = useState('')
    const [openDownload, setOpenDownload] = useState(false)

    useEffect(() => {
        let active = true

        const fetchRegistrants = async () => {
            setError('')
            try {
                const res = await api.get(`/events/${eventId}/registrants`)
                if (active) setRegistrants(res.data)
            } catch (err) {
                if (active) setError(err.response?.data?.message || 'Failed to load registrants')
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchRegistrants()

        return () => {
            active = false
        }
    }, [eventId])

    useEffect(() => {
        const fetchEventTitle = async () => {
            try {
                const res = await api.get(`/events/${eventId}`)
                setEventTitle(res.data?.title || '')
            } catch {
                setEventTitle('')
            }
        }
        if (eventId) fetchEventTitle()
    }, [eventId])

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.download-dropdown')) {
                setOpenDownload(false)
            }
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [])

    const downloadFile = (blob, filename) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    }

    const safeFileName = (value) =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")

    const fileBase = safeFileName(eventTitle) || `event-${eventId}`

    const handleDownloadCsv = async () => {
        try {
            const res = await api.get(`/events/${eventId}/registrants/export/csv`, {
                responseType: 'blob',
            })
            downloadFile(res.data, `event-${fileBase}-registrants.csv`)
        } catch (err) {
            alert(err.response?.data?.message || 'CSV download failed')
        }
    }

    const handleDownloadXlsx = async () => {
        try {
            const res = await api.get(`/events/${eventId}/registrants/export/xlsx`, {
                responseType: 'blob',
            })
            downloadFile(res.data, `event-${fileBase}-registrants.xlsx`)
        } catch (err) {
            alert(err.response?.data?.message || 'XLSX download failed')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading registrants...
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Event Registrants</h1>
                    <p className="text-sm text-gray-500 mt-1 break-words">
                        {eventTitle ? `Event: ${eventTitle}` : `Event ID: ${eventId} `}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                    <div className="relative download-dropdown w-full sm:w-auto">
                        <button
                            onClick={() => setOpenDownload((v) => !v)}
                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 inline-flex items-center justify-center gap-2"
                        >
                            Download <span className="text-sm">▾</span>
                        </button>

                        {openDownload && (
                            <div className="absolute right-0 mt-2 w-full sm:w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                <button
                                    onClick={async () => {
                                        setOpenDownload(false)
                                        await handleDownloadCsv()
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Download CSV
                                </button>

                                <button
                                    onClick={async () => {
                                        setOpenDownload(false)
                                        await handleDownloadXlsx()
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Download XLSX
                                </button>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/my-events"
                        className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50"
                    >
                        Back
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium break-words">
                    {error}
                </div>
            )}

            {!error && (
                <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-[800px] w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-3 sm:px-4 py-3 border-b whitespace-nowrap">Name</th>
                                <th className="text-left px-3 sm:px-4 py-3 border-b whitespace-nowrap">Email</th>
                                <th className="text-left px-3 sm:px-4 py-3 border-b whitespace-nowrap">Institution</th>
                                <th className="text-left px-3 sm:px-4 py-3 border-b whitespace-nowrap">Department</th>
                                <th className="text-left px-3 sm:px-4 py-3 border-b whitespace-nowrap">Year</th>
                                <th className="text-left px-3 sm:px-4 py-3 border-b whitespace-nowrap">Designation</th>
                            </tr>
                            </thead>

                            <tbody>
                            {registrants.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-4 py-3 border-b">{r.name}</td>
                                    <td className="px-3 sm:px-4 py-3 border-b">{r.email}</td>
                                    <td className="px-3 sm:px-4 py-3 border-b">{r.institutionName ?? ""}</td>
                                    <td className="px-3 sm:px-4 py-3 border-b">{r.department}</td>
                                    <td className="px-3 sm:px-4 py-3 border-b">{r.year ?? ""}</td>
                                    <td className="px-3 sm:px-4 py-3 border-b">{r.designation ?? ""}</td>
                                </tr>
                            ))}

                            {registrants.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                                        No registrants yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
