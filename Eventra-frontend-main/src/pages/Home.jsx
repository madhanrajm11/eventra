import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";


export default function Home(){
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        api.get('/events')
            .then(res => setEvents(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    },[])

    if(loading) return(
        <div className="text-center py-20 text-gray-500">Loading events...</div>
    )

    if(events.length === 0) return(
        <div className="text-center py-20 text-gray-500">No Events available</div>
    )

    return(
        <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {events.map(event=> (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        
                        <div className="bg-blue-600 px-4 sm:px-6 py-4">
                            <h2 className="text-white text-xl font-bold">{event.title}</h2>
                            <p className="text-blue-200 text-sm mt-1">{event.organizerName}</p>
                        </div>

                        <div className="px-6 py-4">
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {event.description}
                            </p>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span>📅</span>
                                    <span>{new Date(event.eventDate).toLocaleDateString('en-IN',{
                                        day:'numeric', month:'short', year:'numeric'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📍</span>
                                    <span>{event.venue}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>👥</span>
                                    <span>{event.registeredCount} / {event.capacity} registered</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end">

                                <Link
                                    to={`/events/${event.id}`}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    View Details → 
                                </Link>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}