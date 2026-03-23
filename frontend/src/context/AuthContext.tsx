"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import { IUser } from "../types"

interface AuthContextType {
  user: IUser | null
  login: (userData: IUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null
  )

  const login = (userData: IUser) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}