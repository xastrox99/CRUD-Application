"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Package, ArrowLeft, Save, LogOut, User } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { productService, type CreateProductData } from "../../../lib/api"
import { getUser, logout } from "../../../lib/auth"
import ProtectedRoute from "../../../components/ProtectedRoute"

const EditProductPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const user = getUser()

  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    price: 0,
  })
  const [errors, setErrors] = useState<Partial<CreateProductData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const product = await productService.getProductById(id)
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
      })
    } catch (err: any) {
      toast.error("Failed to load product")
      router.push("/products")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))

    if (errors[name as keyof CreateProductData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProductData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Product name must be at least 2 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await productService.updateProduct(id, formData)
      toast.success("Product updated successfully")
      router.push("/products")
    } catch (err: any) {
      toast.error(err.message || "Failed to update product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-4 h-16 flex items-center">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-gray-800">ProductCRUD</span>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 h-8 w-8"></div>
              <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-gray-800">ProductCRUD</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/products"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Products
                  </Link>
                  <Link
                    href="/products/new"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Add Product
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/products")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600">Update product information</p>
              </div>
            </div>

            {/* Form */}
            <div className="card p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`input-field resize-none ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Enter product description"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`input-field ${errors.price ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push("/products")}
                    className="btn-secondary flex-1 sm:flex-none"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center justify-center space-x-2 flex-1 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Update Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Toaster position="top-right" />
      </div>
    </ProtectedRoute>
  )
}

export default EditProductPage
