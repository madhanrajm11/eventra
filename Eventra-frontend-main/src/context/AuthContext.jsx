import { useState } from "react"
import AuthContext from "./AuthContextCore.js"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() =>{
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const role = localStorage.getItem('role')
        const name = localStorage.getItem('name')
        const designation = localStorage.getItem('designation')
        const email = localStorage.getItem('email')
        return token ? { token, userId, role, name, designation, email } : null
    })

    const login = (data) =>{
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId',data.userId.toString())
        localStorage.setItem('role', data.role)
        localStorage.setItem('name', data.name)
        localStorage.setItem('designation', data.designation || '')
        localStorage.setItem('email', data.email)
        setUser(data)
    }

    const logout = () =>{
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
        localStorage.removeItem('designation')
        localStorage.removeItem('email')
        setUser(null)
    }

    const updateUser = (patch) =>{
        setUser((prev) =>{
            if (!prev) return prev
            const next = { ...prev, ...patch }
            if (next.name !== undefined) localStorage.setItem('name', next.name || '')
            if (next.email !== undefined) localStorage.setItem('email', next.email || '')
            if (next.designation !== undefined) localStorage.setItem('designation', next.designation || '')
            return next
        })
    }

    return(
        <AuthContext.Provider value={{user, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}
