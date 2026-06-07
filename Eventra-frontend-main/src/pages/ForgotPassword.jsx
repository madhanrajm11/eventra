import api from '../api/axios.js'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const res = await api.post('/auth/forgot-password/otp', { email })
            setMessage(res.data?.message || `An OTP has been sent to your email ${email}.`)
            setTimeout(() => navigate('/reset-password', { state: { email } }), 600)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
                    Forgot Password
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Enter your registered email to receive an OTP
                </p>

                {message && (
                    <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm break-words">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm break-words">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Back to{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}