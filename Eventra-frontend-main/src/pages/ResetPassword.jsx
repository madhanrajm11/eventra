import api from '../api/axios.js'
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

export default function ResetPassword() {
    const location = useLocation()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: location.state?.email || '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (form.newPassword !== form.confirmPassword) {
            setError("New password and confirm password do not match")
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/forgot-password/reset', form)
            setMessage(res.data?.message || "Password reset successful, Please login.")
            setTimeout(() => navigate('/login'), 900)
        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
                    Reset Password
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Enter OTP and set a new password
                </p>

                {message && (
                    <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm break-words">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm break-words">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                OTP
                            </label>
                            <input
                                type="text"
                                name="otp"
                                value={form.otp}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="6-digit OTP"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                minLength={8}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Back to{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}