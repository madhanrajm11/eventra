import api from '../api/axios.js'
import { useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

export default function ScanQR() {
    const [searchParams] = useSearchParams()
    const eventId = searchParams.get('eventId')

    const [session, setSession] = useState(null)
    const [attendance, setAttendance] = useState([])
    const [sessionLoading, setSessionLoading] = useState(false)
    const [duration, setDuration] = useState(30)
    const [markLoading, setMarkLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [timeLeft, setTimeLeft] = useState(null)
    const [scanning, setScanning] = useState(false)

    const html5QrCodeRef = useRef(null)
    const sessionRef = useRef(null)
    const markAttendanceRef = useRef(null)

    const openSession = async () => {
        setSessionLoading(true)
        setMessage('')
        setError('')
        try {
            const res = await api.post(`/attendance/sessions/events/${eventId}`, null, {
                params: { durationMinutes: duration }
            })
            setSession(res.data)
            setMessage(`✅ Session opened for ${duration} minutes!`)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to open session')
        } finally {
            setSessionLoading(false)
        }
    }

    const markAttendance = async (qrCode) => {
        if (!qrCode.trim() || !sessionRef.current) {
            setError('No active session found.')
            return
        }

        setMarkLoading(true)
        setMessage('')
        setError('')
        try {
            const res = await api.post(`/attendance/mark`, {
                sessionToken: sessionRef.current.sessionToken,
                qrCode: qrCode.trim()
            })

            setAttendance(prev => [res.data, ...prev])
            setMessage(`✅ Attendance marked for ${res.data.attendeeName}!`)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark attendance')
        } finally {
            setMarkLoading(false)
        }
    }

    useEffect(() => {
        markAttendanceRef.current = markAttendance
    })

    useEffect(() => {
        sessionRef.current = session
    }, [session])

    useEffect(() => {
        if (!session) return
        const interval = setInterval(() => {
            const diff = Math.max(0, Math.floor((new Date(session.expiresAt + 'Z') - new Date()) / 1000))
            setTimeLeft(diff)
            if (diff === 0) clearInterval(interval)
        }, 1000)
        return () => clearInterval(interval)
    }, [session])

    useEffect(() => {
        if (!eventId) return

        api.get(`/attendance/sessions/events/${eventId}`)
            .then(res => {
                const session = res.data
                if (session.length > 0) {
                    const latest = session[session.length - 1]
                    const isActive = latest.isActive && new Date(latest.expiresAt + 'Z') > new Date()
                    if (isActive) {
                        setSession(latest)
                    } else {
                        setSession(null)
                    }
                }
            })
            .catch(() => {})

        api.get(`/attendance/events/${eventId}`)
            .then(res => setAttendance(res.data))
            .catch(() => {})
    }, [eventId])

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(() => {})
            }
        }
    }, [])

    const startScanner = () => {
        setScanning(true)
    }

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            await html5QrCodeRef.current.stop()
            html5QrCodeRef.current = null
        }
        setScanning(false)
    }

    useEffect(() => {
        if (!scanning) return

        const html5QrCode = new Html5Qrcode('qr-reader')
        html5QrCodeRef.current = html5QrCode

        html5QrCode.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            async (decodedText) => {
                await html5QrCode.pause()
                await markAttendanceRef.current(decodedText)
                setTimeout(() => {
                    if (html5QrCodeRef.current) {
                        try {
                            html5QrCode.resume()
                        } catch {
                            // The scanner may already be stopped while the pause timeout is pending.
                        }
                    }
                }, 2000)
            },
            () => { }
        ).catch((err) => {
            setError('Camera error: ' + err.message)
            setScanning(false)
        })
    }, [scanning])

    const formatTime = (seconds) => {
        if (seconds === null) return
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        return new Date(dateStr.replace('T', ' ')).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
        })
    }

    const isSessionActive = session && session.isActive && (timeLeft === null || timeLeft > 0)

    if (!eventId) return (
        <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-xl font-medium">No event selected</p>
            <p className="text-sm mt-1">Please open this page from My Events.</p>
        </div>
    )

    return (
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">QR Attendance</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Open a session and scan student QR codes to mark attendance
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Attendance Session</h2>

                {!isSessionActive ? (
                    <div>
                        <p className="text-sm text-gray-500 mb-4">
                            No active session. Open one to start marking attendance.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                            <div className="w-full sm:w-auto">
                                <label className="text-xs text-gray-500 block mb-1">Duration (minutes)</label>
                                <select
                                    value={duration}
                                    onChange={e => setDuration(Number(e.target.value))}
                                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {[10, 15, 20, 30, 45, 60].map(d => (
                                        <option key={d} value={d}>{d} min</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={openSession}
                                disabled={sessionLoading}
                                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {sessionLoading ? 'Opening...' : '▶ Open Session'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse inline-block"></span>
                                <span className="text-green-700 font-medium text-sm">Session Active</span>
                                {markLoading && <span className="text-xs text-gray-400">(marking...)</span>}
                            </div>
                            <div className={`text-2xl font-mono font-bold ${timeLeft !== null && timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                                ⏱ {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                            </div>
                        </div>

                        <div className="mb-4">
                            {!scanning ? (
                                <button
                                    onClick={startScanner}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    📷 Start Camera Scanner
                                </button>
                            ) : (
                                <div>
                                    <div id="qr-reader" className="w-full rounded-lg overflow-hidden mb-3" />
                                    <button
                                        onClick={stopScanner}
                                        className="w-full border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
                                    >
                                        ✕ Stop Scanner
                                    </button>
                                </div>
                            )}
                        </div>

                        {session && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">Session Token</p>
                                <p className="text-xs font-mono text-gray-600 break-all">{session?.sessionToken}</p>
                            </div>
                        )}
                    </div>
                )}

                {message && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm break-words">{message}</div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm break-words">{error}</div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Attendance Record</h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
            {attendance.length} marked
          </span>
                </div>

                {attendance.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">
                        No attendance marked yet.
                    </p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {attendance.map((a, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {a.attendeeName?.charAt(0) ?? '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{a.attendeeName}</p>
                                        <p className="text-xs text-gray-400 truncate">{a.attendeeEmail}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                  {formatDate(a.markedAt)}
                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
