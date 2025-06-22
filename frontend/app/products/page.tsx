"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Plus, Search, Edit, Trash2, DollarSign, LogOut, User } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { productService, type Product } from "../lib/api"
import { getUser, logout } from "../lib/auth"
import ProtectedRoute from "../components/ProtectedRoute"

// Loading Spinner Component
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 h-8 w-8"></div>
    <p className="mt-4 text-gray-600">{text}</p>
  </div>
)

// Product Card Component
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit product"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-blue-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-semibold">{formatPrice(product.price)}</span>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Available</span>
      </div>
    </div>
  )
}

// Main Products Page Component
const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (err: any) {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    router.push(`/products/edit/${product.id}`)
  }

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId.toString())
        setProducts(products.filter((p) => p.id !== productId))
        toast.success("Product deleted successfully")
      } catch (err: any) {
        toast.error("Failed to delete product")
      }
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <LoadingSpinner text="Loading products..." />
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
                  <Link href="/products" className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium">
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
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
            <Link href="/products/new" className="btn-primary flex items-center space-x-2 w-fit">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {searchTerm ? "No products found" : "No products yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
              </p>
              {!searchTerm && (
                <Link href="/products/new" className="btn-primary">
                  Add Product
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Stats */}
          {products.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                  <p className="text-gray-600">Total Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{products.length}</p>
                  <p className="text-gray-600">Available</p>
                </div>
              </div>
            </div>
          )}
        </main>

        <Toaster position="top-right" />
      </div>
    </ProtectedRoute>
  )
}

export default ProductsPage
