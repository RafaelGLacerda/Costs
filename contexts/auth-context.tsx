"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthUser, LoginData, RegisterData } from "@/lib/types"
import { authService } from "@/lib/services/auth-service"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (data: Partial<AuthUser>) => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há uma sessão ativa
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (data: LoginData) => {
    const result = authService.login(data)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return { success: result.success, message: result.message }
  }

  const register = async (data: RegisterData) => {
    const result = authService.register(data)
    if (result.success && result.user) {
      setUser(result.user)
      authService.setSession(result.user)

      // Verificar se o usuário foi realmente salvo
      console.log("Usuário registrado:", result.user)
      console.log("Usuários salvos:", localStorage.getItem("costs_users"))
    }
    return { success: result.success, message: result.message }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    const result = authService.updateProfile(data)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return { success: result.success, message: result.message }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
