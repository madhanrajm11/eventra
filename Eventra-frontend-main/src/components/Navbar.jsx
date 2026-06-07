import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from "../context/useAuth"
import { useEffect, useRef, useState } from "react"

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [openProfile, setOpenProfile] = useState(false)
    const [openMobile, setOpenMobile] = useState(false)

    const dropdownRef = useRef(null)

    const handleLogout = () => {
        setOpenMobile(false)
        setOpenProfile(false)
        logout()
        navigate('/login')
    }

    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 rounded-md transition text-sm font-medium ${
            isActive
                ? "bg-white text-blue-700 shadow-sm"
                : "text-white hover:bg-blue-500/40 hover:text-white"
        }`

    const mobileLinkClass = ({ isActive }) =>
        `block w-full px-3 py-2 rounded-md transition text-sm font-medium ${
            isActive ? "bg-white/15 text-white" : "text-white hover:bg-white/10"
        }`


    useEffect(() => {
        const handler = (e) => {
            if (!dropdownRef.current) return
            if (!dropdownRef.current.contains(e.target)) setOpenProfile(false)
        }
        if (openProfile) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [openProfile])


    useEffect(() => {
        if (!openMobile) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = prev }
    }, [openMobile])


    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 640) setOpenMobile(false)
        }
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    const initial = user?.name?.trim()?.[0]?.toUpperCase() || "U"

    return (
        <nav className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4">
            <div className="mx-auto w-full max-w-6xl">
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-xl font-bold tracking-wide"
                        onClick={() => setOpenMobile(false)}
                    >
                        Eventra
                    </Link>


                    <button
                        type="button"
                        onClick={() => setOpenMobile(v => !v)}
                        className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-blue-500/40"
                        aria-label="Toggle menu"
                        title="Menu"
                    >
                        ☰
                    </button>


                    <div className="hidden sm:flex items-center gap-2 md:gap-6">
                        <NavLink to="/" className={navLinkClass} end>
                            Events
                        </NavLink>

                        {!user && (
                            <>
                                <NavLink to="/login" className={navLinkClass}>
                                    Login
                                </NavLink>
                                <NavLink to="/register" className={navLinkClass}>
                                    Register
                                </NavLink>
                            </>
                        )}

                        {user && (
                            <>
                                <NavLink to="/my-registrations" className={navLinkClass}>
                                    My Registrations
                                </NavLink>
                                <NavLink to="/my-events" className={navLinkClass}>
                                    My Events
                                </NavLink>
                                <NavLink to="/my-attendance" className={navLinkClass}>
                                    My Participation
                                </NavLink>
                                <NavLink to="/create-event" className={navLinkClass}>
                                    Create Event
                                </NavLink>
                            </>
                        )}

                        {user?.role === "ADMIN" && (
                            <>
                                <NavLink to="/admin-dashboard" className={navLinkClass}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/pending-events" className={navLinkClass}>
                                    Approvals
                                </NavLink>
                            </>
                        )}

                        {user && (
                            <div className="flex items-center gap-3 md:gap-4">
                <span className="hidden md:inline text-blue-200 text-sm">
                  Hi, {user.name}
                </span>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenProfile(v => !v)}
                                        className="w-9 h-9 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center shadow-sm hover:bg-blue-50"
                                        aria-label="Open profile menu"
                                        title="Profile"
                                    >
                                        {initial}
                                    </button>

                                    {openProfile && (
                                        <div className="absolute right-0 mt-3 w-72 max-w-[90vw] bg-white text-gray-800 rounded-lg shadow-lg border border-gray-100 p-4 z-50">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                                                    {initial}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="font-semibold truncate">{user.name}</div>
                                                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenProfile(false)
                                                        navigate("/profile")
                                                    }}
                                                    className="w-full bg-blue-600 text-white px-3 py-2 rounded font-medium hover:bg-blue-700"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="bg-white text-blue-600 px-3 py-2 rounded font-medium hover:bg-blue-50 text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                {openMobile && (
                    <div className="sm:hidden fixed inset-0 z-50">
                        {/* backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setOpenMobile(false)}
                        />

                        {/* drawer */}
                        <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-blue-600 text-white shadow-xl">
                            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                                <div className="text-lg font-bold">Menu</div>
                                <button
                                    type="button"
                                    className="w-10 h-10 rounded-md hover:bg-blue-500/40"
                                    onClick={() => setOpenMobile(false)}
                                    aria-label="Close menu"
                                    title="Close"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="px-3 py-3 overflow-y-auto h-[calc(100vh-64px)] space-y-2">
                                {!user && (
                                    <>
                                        <NavLink to="/" className={mobileLinkClass} end onClick={() => setOpenMobile(false)}>
                                            Events
                                        </NavLink>

                                        <div className="space-y-2 pt-2">
                                            <NavLink to="/login" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                                Login
                                            </NavLink>
                                            <NavLink to="/register" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                                Register
                                            </NavLink>
                                        </div>
                                    </>
                                )}

                                {user && (
                                    <>

                                        <div className="px-3 py-3 rounded-lg bg-gradient-to-r from-white/15 to-white/5 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center shadow-sm">
                                                    {initial}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold truncate text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs truncate text-blue-100">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <NavLink to="/" className={mobileLinkClass} end onClick={() => setOpenMobile(false)}>
                                            Events
                                        </NavLink>

                                        <NavLink to="/my-registrations" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                            My Registrations
                                        </NavLink>
                                        <NavLink to="/my-events" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                            My Events
                                        </NavLink>
                                        <NavLink to="/my-attendance" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                            My Participation
                                        </NavLink>
                                        <NavLink to="/create-event" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                            Create Event
                                        </NavLink>

                                        {user?.role === "ADMIN" && (
                                            <>
                                                <NavLink to="/admin-dashboard" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                                    Dashboard
                                                </NavLink>
                                                <NavLink to="/pending-events" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>
                                                    Approvals
                                                </NavLink>
                                            </>
                                        )}

                                        <div className="pt-2 space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenMobile(false)
                                                    navigate("/profile")
                                                }}
                                                className="w-full bg-white text-blue-700 px-3 py-2 rounded font-medium text-sm"
                                            >
                                                View Profile
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full bg-white text-blue-600 px-3 py-2 rounded font-medium hover:bg-blue-50 text-sm"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
