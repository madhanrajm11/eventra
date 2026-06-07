import api from '../api/axios.js'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { useEffect, useState } from "react"

export default function EditProfile() {
    const navigate = useNavigate()
    const { updateUser } = useAuth()

    const [form, setForm] = useState({ name: "", year: "" })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await api.get('/users/me')
                setForm({
                    name: res.data?.name || '',
                    year: res.data?.year ?? ''
                })
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')

        try {
            await api.put('/users/me', {
                name: form.name,
                year: form.year === "" ? null : Number(form.year),
            })

            updateUser({ name: form.name })
            navigate('/profile')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>

    return (
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium break-words">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
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
