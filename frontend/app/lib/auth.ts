import Cookies from "js-cookie"

export interface User {
  id: number
  username: string
  email: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Token management
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || Cookies.get("token") || null
  }
  return null
}

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
    Cookies.set("token", token, { expires: 7 }) // 7 days
  }
}

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    Cookies.remove("token")
  }
}

// User management
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export const setUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// Logout function
export const logout = (): void => {
  removeToken()
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}
