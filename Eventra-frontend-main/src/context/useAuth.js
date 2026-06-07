import { useContext } from "react"
import AuthContext from "./AuthContextCore.js"

export function useAuth() {
    return useContext(AuthContext)
}
