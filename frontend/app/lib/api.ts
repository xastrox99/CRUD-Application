import axios from "axios"
import { getToken, logout, type AuthResponse } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
      const token = getToken()
      console.log("🔑 Token being sent:", token ? "Present" : "Missing")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log("🔑 Authorization header set:", `Bearer ${token.substring(0, 20)}...`)
      } else {
        console.log("⚠️ No token found - request will be sent without authentication")
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("🚨 Response error intercepted:", error.response?.status)
      if (error.response?.status === 401) {
        console.log("🚨 401 Unauthorized - logging out user")
        logout()
      }
      return Promise.reject(error)
    },
)

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
}

// Auth API - NO /api prefix
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log("🔄 Attempting login to:", `${API_BASE_URL}/auth/login`)
      console.log("📤 Login payload:", { username: credentials.username, password: "***" })

      const response = await api.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      })

      console.log("✅ Login response:", response.data)

      // Your backend returns: { "token": "jwt_token_here" }
      const { token } = response.data

      return {
        token: token,
        user: { username: credentials.username },
      }
    } catch (error: any) {
      console.error("❌ Login error:", error)
      console.error("❌ Login error response:", error.response?.data)
      console.error("❌ Login error status:", error.response?.status)

      let errorMessage = "Login failed"

      if (error.response?.data) {
        errorMessage =
            typeof error.response.data === "string" ? error.response.data : error.response.data.message || errorMessage
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      console.log("🔄 Attempting registration to:", `${API_BASE_URL}/auth/register`)
      console.log("📤 Registration payload:", { username: userData.username, password: "***" })

      const response = await api.post("/auth/register", {
        username: userData.username,
        password: userData.password,
      })

      console.log("✅ Registration response status:", response.status)
      console.log("✅ Registration response data:", response.data)

      // Your backend returns: "User registered successfully." as plain text
      return {
        message: response.data,
        user: { username: userData.username },
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error)
      console.error("❌ Registration error response:", error.response?.data)
      console.error("❌ Registration error status:", error.response?.status)

      let errorMessage = "Registration failed"

      if (error.response?.data) {
        errorMessage =
            typeof error.response.data === "string" ? error.response.data : error.response.data.message || errorMessage
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me")
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get user info")
    }
  },
}

// Product API - WITH /api prefix
export interface Product {
  id: number
  name: string
  description: string
  price: number
  // Removed quantity since your backend doesn't have it
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  // Removed quantity since your backend doesn't have it
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log("🔄 Fetching products from:", `${API_BASE_URL}/api/products`)
      console.log("🔑 Current token:", getToken() ? "Present" : "Missing")

      const response = await api.get("/api/products")
      console.log("✅ Products response status:", response.status)
      console.log("✅ Products response data:", response.data)
      return response.data
    } catch (error: any) {
      console.error("❌ Failed to fetch products:", error)
      console.error("❌ Fetch products error response:", error.response?.data)
      console.error("❌ Fetch products error status:", error.response?.status)
      console.error("❌ Full error object:", JSON.stringify(error.response?.data, null, 2))

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Show more detailed error message
      let errorMessage = "Failed to fetch products"
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else {
          errorMessage = `Server error (${error.response.status}): ${JSON.stringify(error.response.data)}`
        }
      }

      throw new Error(errorMessage)
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      console.log("🔄 Fetching product:", `${API_BASE_URL}/api/products/${id}`)
      const response = await api.get(`/api/products/${id}`)
      console.log("✅ Product response:", response.data)
      return response.data
    } catch (error: any) {
      console.error("❌ Failed to fetch product:", error)
      console.error("❌ Fetch product error response:", error.response?.data)
      console.error("❌ Fetch product error status:", error.response?.status)

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.")
      }

      let errorMessage = "Failed to fetch product"
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      }

      throw new Error(errorMessage)
    }
  },

  createProduct: async (productData: CreateProductData): Promise<Product> => {
    try {
      console.log("🔄 Creating product at:", `${API_BASE_URL}/api/products`)
      console.log("📤 Product payload:", JSON.stringify(productData, null, 2))
      console.log("🔑 Current token:", getToken() ? "Present" : "Missing")

      // Only send the fields your backend expects: name, description, price
      const payload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        // Removed quantity - not sending it to backend
      }

      console.log("📤 Actual payload being sent:", JSON.stringify(payload, null, 2))

      const response = await api.post("/api/products", payload)
      console.log("✅ Create product response status:", response.status)
      console.log("✅ Create product response data:", response.data)
      return response.data
    } catch (error: any) {
      console.error("❌ Failed to create product:", error)
      console.error("❌ Create product error response:", error.response?.data)
      console.error("❌ Create product error status:", error.response?.status)
      console.error("❌ Full create error object:", JSON.stringify(error.response?.data, null, 2))

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Show more detailed error message
      let errorMessage = "Failed to create product"
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else {
          errorMessage = `Server error (${error.response.status}): ${JSON.stringify(error.response.data)}`
        }
      }

      throw new Error(errorMessage)
    }
  },

  updateProduct: async (id: string, productData: CreateProductData): Promise<Product> => {
    try {
      console.log("🔄 Updating product:", `${API_BASE_URL}/api/products/${id}`)
      console.log("📤 Update payload:", productData)

      // Only send the fields your backend expects: name, description, price
      const payload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        // Removed quantity - not sending it to backend
      }

      const response = await api.put(`/api/products/${id}`, payload)
      console.log("✅ Update product response:", response.data)
      return response.data
    } catch (error: any) {
      console.error("❌ Failed to update product:", error)
      console.error("❌ Update product error response:", error.response?.data)
      console.error("❌ Update product error status:", error.response?.status)

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.")
      }

      let errorMessage = "Failed to update product"
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      }

      throw new Error(errorMessage)
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      console.log("🔄 Deleting product:", `${API_BASE_URL}/api/products/${id}`)
      await api.delete(`/api/products/${id}`)
      console.log("✅ Product deleted successfully")
    } catch (error: any) {
      console.error("❌ Failed to delete product:", error)
      console.error("❌ Delete product error response:", error.response?.data)
      console.error("❌ Delete product error status:", error.response?.status)

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.")
      }

      let errorMessage = "Failed to delete product"
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      }

      throw new Error(errorMessage)
    }
  },
}
