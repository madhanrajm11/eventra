import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/useAuth'
import api from '../api/axios'

export default function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async(e) =>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            const res = await api.post('/auth/login', { email, password })
            login({
                token: res.data.token,
                role: res.data.role,
                name: res.data.name,
                designation: res.data.designation,
                email: res.data.email,
                userId : res.data.userId
            })

            const role = res.data.role
            if(role === 'ADMIN') navigate('/admin-dashboard')
            else if(role === 'ORGANIZER') navigate('/organizer-dashboard')
            else navigate('/')
        } catch{
                setError("Invalid email or password")
        } finally{
            setLoading(false)
        }
    }

    return(
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white p-8 sm:p-8 rounded-lg shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
                    Welcome to Eventra
                </h1>
                <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

                {error &&(
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
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

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                            >
                                {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Signing in....' : 'Sign In'}
                    </button>

                </form>

                <div className='flex justify-center mt-4 mb-4'>
                    <Link to='/forgot-password' className='text-sm text-blue-600 hover:underline'>
                        Forgot password?
                    </Link>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}
