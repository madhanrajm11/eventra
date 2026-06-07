import api from '../api/axios.js'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { useState } from "react"

export default function ChangePassword() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.newPassword !== form.confirmNewPassword) {
            setError('New password and confirm password do not match')
            return
        }

        setSaving(true)
        try {
            await api.put('/users/me/password', form)
            logout()
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Password change failed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium break-words">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={form.confirmNewPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Updating...' : 'Update Password'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="w-full sm:w-auto border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
