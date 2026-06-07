import api from "../api/axios.js"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/dashboard`)
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="text-center py-20 text-gray-500">Loading dashboard...</div>
    )

    if (!stats) return (
        <div className="text-center py-20 text-gray-500">Failed to load dashboard.</div>
    )

    const cards = [
        { label: 'Total Users', value: stats.totalUser, color: 'text-blue-600' },
        { label: 'Total Events', value: stats.totalEvents, color: 'text-purple-600' },
        { label: 'Total Registrations', value: stats.totalRegistration, color: 'text-green-600' },
        { label: 'Total Attendance', value: stats.totalAttendance, color: 'text-orange-600' },
        { label: 'Active Events', value: stats.activeEvents, color: 'text-teal-600' },
        { label: 'Cancelled Events', value: stats.cancelledEvents, color: 'text-red-600' },
        { label: 'Pending Approvals', value: stats.pendingEventApprovals, color: 'text-yellow-600' },
    ]

    const pendingCount = stats.pendingApprovals ?? stats.pendingEventApprovals ?? 0

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map(card => (
                    <div key={card.label} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/pending-events"
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 inline-flex items-center justify-center gap-2"
                    >
                        Review Pending Events
                        {pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    )
}