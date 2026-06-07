import { useState,useEffect } from "react";
import api from './../api/axios';


export default function MyRegistrations(){
    const [registrations, setRegistration] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedQr, setSelectedQr] = useState(null) 

    useEffect(() =>{
        api.get('/registration/my')
            .then(res => setRegistration(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="text-center py-20 text-gray-500">Loading registration...</div>
    )

    if(registrations.length === 0) return(
        <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-2">No registration yet</p>
            <p className="text-sm">Browse events and register to see them here.</p>
        </div>
    )

    return(
        <div className='mx-auto w-full max-w-6xl sm:px-6 lg:px-8'>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Registration</h1>

            {selectedQr && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedQr(null)}>
                        <div className="bg-white p-6 rounded-lg text-center w-[92vw] max-w-sm" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold mb-4">Your QR Code</h3>
                            <img
                                src={`data:image/png;base64,${selectedQr}`}
                                alt="QR Code"
                                className="w-48 h-48 mx-auto"
                            />
                            <p className="text-sm text-gray-500 mt-4">Show this at the event entry</p>
                            <button
                                onClick={() => setSelectedQr(null)}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"                           
                            >   
                                Close    
                            </button>
                        </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {registrations.map(reg => (
                    <div key={reg.id} className="bg-white rounded-lg shadow-md p-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-1">{reg.eventTitle}</h2>
                        <p className="text-gray-500 text-sm mb-4">📍 {reg.eventVenue}</p>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">

                            <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span>{new Date(reg.eventDate).toLocaleDateString('en-IN', {
                                    day:'numeric', month:'long', year:'numeric'
                                })}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span>🕑</span>
                                <span>{new Date(reg.registeredAt).toLocaleDateString('en-IN',{
                                    day:'numeric', month:'long', year:'numeric'
                                })}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedQr(reg.qrCode)}
                            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
                        >
                            View QR Code
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}