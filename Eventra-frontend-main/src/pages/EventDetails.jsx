import { useState, useEffect } from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import { useAuth } from '../context/useAuth'
import api from './../api/axios';


export default function EventDetails(){
    const { id } = useParams()
    const {user} = useAuth()
    const navigate = useNavigate()

    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [registering, setRegistering] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() =>{
        api.get(`/events/${id}`)
        .then(res => setEvent(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }, [id])

    const handleRegister = async () => {
        if(!user){
            navigate('/login')
            return
        }

        setRegistering(true)
        setError('')
        setMessage('')

        try{
            await api.post(`/registration/events/${id}`)
            setMessage('🎉 Successfully registered! Check your email for confirmation.')
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed')
        }finally{
            setRegistering(false)
        }
    }

    if(loading) return(
        <div className="text-center py-20 text-gray-500">Loading event...</div>
    )

    if(!event) return(
        <div className="text-center py-20 text-gray-500">Event not found.</div>
    )

    const isFull = event.registeredCount >= event.capacity
    const isExpired = new Date() > new Date(event.registrationDeadline)
    const isCancelled = event.status === 'CANCELLED'
    const isRejected = event.status === 'REJECTED'
    const canRegister = !isFull && !isExpired && !isCancelled && !isRejected && user?.role === 'USER'
    const isEventOwner = user && event.organizerId && event.organizerId === Number(user.userId)


    return(
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">

            <div className="bg-blue-600 rounded-t-lg px-4 sm:px-8 py-5 sm:py-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{event.title}</h1>
                <p className="text-blue-200 mt-1">Organized by {event.organizerName}</p>
            </div>

            <div className="bg-white rounded-b-lg shadow-md px-8 py-6">

                <p className="text-gray-700 mb-6">{event.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Event Date</p>
                        <p className="font-medium text-gray-800">
                            {new Date(event.eventDate).toLocaleDateString('en-IN',{
                                day: 'numeric', month: 'long', year:'numeric',
                                hour:'2-digit', minute:'2-digit'
                            })}
                        </p>
                    </div> 
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Venue</p>
                        <p className="font-medium text-gray-800">{event.venue}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Registration Deadline</p>
                        <p className="font-medium text-gray-800">
                            {new Date(event.registrationDeadline).toLocaleDateString('en-IN',{
                                day:'numeric', month:'long', year:'numeric'
                            })}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Capacity</p>
                        <p className="font-medium text-gray-800">
                            {event.registeredCount} / {event.capacity} registered
                        </p>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 rounded-full h-2"
                                style={{width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="bg-green-50 text-green-700 rounded-lg mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {isEventOwner &&(
                    <div className='mb-4'>
                        <Link
                            to={`/events/${id}/registrants`}
                            className="inline-flex items-center justify-center w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                        >
                            👥 View Registrants / Download
                        </Link>
                    </div>
                )}

                {!user && (
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                    >
                        Login to Register
                    </button>
                )}

                {user?.role === 'USER' && (
                    <button
                        onClick={handleRegister}
                        disabled={!canRegister || registering}
                        className={`w-full py-3 rounded-lg font-medium ${
                            canRegister
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        >
                        {registering ? 'Registering...':
                         isFull ? 'Event Full':
                         isExpired ? 'Registration Closed':
                         isCancelled ? 'Event Cancelled':
                         isRejected ? 'Event Rejected':
                         'Register for this Event'}
                    </button>
                )}

                {user?.role === 'ADMIN' &&(
                    <div className="bg-yellow-50 text-yellow-700 text-sm p-3 rounded-lg text-center">
                        👤 Admins cannot register for events
                    </div>
                )}

            </div>
        </div>
    )
}
