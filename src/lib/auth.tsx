// lib/auth-context.tsx

'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  isAdmin: boolean
  login: (token: string, isAdmin:boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
    const isAdmin = localStorage.getItem('is_admin')
    setIsAdmin(!!isAdmin)
  }, [])

  const login = (token: string,isAdmin:boolean) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('is_admin', isAdmin.toString())
    setIsLoggedIn(true)
    setIsAdmin(isAdmin)
  }

  const logout = () => {
    console.log("Here!");
    localStorage.removeItem('access_token')
    localStorage.removeItem('is_admin')
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
