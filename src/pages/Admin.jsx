import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, Home, Save, X, Upload, Lock } from 'lucide-react'
import API_URL from '../config'
import AdminDashboard from '../components/AdminDashboard'

const Admin = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([]) // New Orders State
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'orders'
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Ashtrays',
    stock: '',
    images: []
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('adminToken')

  // Get headers with auth token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  })

  // Check if already authenticated on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/admin/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (response.ok) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('adminToken')
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          localStorage.removeItem('adminToken')
        }
      }
      setIsLoading(false)
    }
    verifyToken()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchOrders() // Refresh
        alert('Order status updated')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'products') fetchProducts()
      if (activeTab === 'orders') fetchOrders()
    }
  }, [isAuthenticated, activeTab])

  const handleLogin = async (e) => {
    e.preventDefault()
    setPasswordError('')

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setPasswordError(data.error || 'Mot de passe incorrect')
        setPassword('')
      }
    } catch (error) {
      console.error('Login error:', error)
      setPasswordError('Erreur de connexion au serveur')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setProducts([])
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let imageUrl = formData.image

      if (imageFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('image', imageFile)

        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          body: formDataUpload
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`)
        }

        const uploadData = await uploadResponse.json()
        console.log('Upload response:', uploadData)

        if (!uploadData.imageUrl) {
          throw new Error('No image URL returned from upload')
        }

        imageUrl = uploadData.imageUrl
        imageUrl = uploadData.imageUrl
        console.log('Image URL to save:', imageUrl)
      }

      // Handle Gallery Uploads
      let galleryUrls = [...(formData.images || [])]

      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const formDataUpload = new FormData()
          formDataUpload.append('image', file)

          const uploadResponse = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` },
            body: formDataUpload
          })

          if (uploadResponse.ok) {
            const data = await uploadResponse.json()
            if (data.imageUrl) {
              galleryUrls.push(data.imageUrl)
            }
          }
        }
      }

      const productData = {
        ...formData,
        image: imageUrl,
        images: galleryUrls
      }

      if (editingProduct) {
        await fetch(`${API_URL}/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData)
        })
      } else {
        await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData)
        })
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price || '',
      image: product.image || '',
      stock: product.stock !== null && product.stock !== undefined ? product.stock : '',
      images: product.images || []
    })
    setImagePreview(product.image || '')
    setGalleryPreviews(product.images || [])
    setGalleryFiles([])
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', image: '', stock: '', images: [] })
    setImageFile(null)
    setImagePreview('')
    setGalleryFiles([])
    setGalleryPreviews([])
    setEditingProduct(null)
    setShowForm(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gold-600"></div>
          <p className="mt-4 text-gray-400">Vérification...</p>
        </div>
      </div>
    )
  }

  // Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-dark-800 border-2 border-gold-600 border-opacity-30 rounded-2xl shadow-2xl p-8">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-gradient rounded-full mb-4">
                <Lock className="w-8 h-8 text-dark-900" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">Admin Panel</h1>
              <p className="text-gray-400">Tafaya Shop</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe admin"
                  className="w-full px-4 py-3 bg-dark-900 border-2 border-gold-600 border-opacity-20 rounded-xl focus:ring-2 focus:ring-gold-600 focus:border-gold-600 text-white placeholder-gray-500 transition-all"
                  required
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <span>⚠️</span> {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gold-gradient hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] text-dark-900 py-3 rounded-xl font-bold text-lg transition-all shadow-xl transform hover:scale-105 uppercase tracking-wider"
              >
                Se connecter
              </button>
            </form>

            {/* Back to shop link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gold-400 transition-colors text-sm flex items-center gap-2 mx-auto"
              >
                <Home className="w-4 h-4" />
                Retour à la boutique
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Admin Panel - Tafaya Shop</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Lock className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>View Shop</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <AdminDashboard products={products} orders={orders} />

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            {/* Add Product Button */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mb-8 flex items-center space-x-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Product</span>
              </button>
            )}

            {/* Product Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Classic Ceramic Ashtray"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Describe the product..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (MAD)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g., 150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="Ashtrays">Ashtrays</option>
                        <option value="Home Decor">Home Decor</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock (leave empty for unlimited)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 10 (empty = unlimited)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                          <Upload className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-sm text-gray-500">or</span>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => {
                            setFormData({ ...formData, image: e.target.value })
                            setImagePreview(e.target.value)
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter image URL"
                        />
                      </div>

                      {imagePreview && (
                        <div className="relative inline-block mt-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview('')
                              setFormData({ ...formData, image: '' })
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gallery Images
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                          <Upload className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Add Images</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files)
                                setGalleryFiles(prev => [...prev, ...files])
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {/* Existing Images */}
                        {galleryPreviews.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img src={url} alt={`Gallery ${index}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = galleryPreviews.filter((_, i) => i !== index)
                                setGalleryPreviews(newUrls)
                                setFormData(prev => ({ ...prev, images: newUrls }))
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* New Files */}
                        {galleryFiles.map((file, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img src={URL.createObjectURL(file)} alt="New upload" className="w-24 h-24 object-cover rounded-lg border-2 border-blue-400" />
                            <button
                              type="button"
                              onClick={() => {
                                setGalleryFiles(prev => prev.filter((_, i) => i !== index))
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Products ({products.length})</h2>
              </div>

              {products.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>No products yet. Add your first product to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={product.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image' }}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">{product.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.price ? `${product.price} MAD` : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.stock === null || product.stock === undefined ? (
                              <span className="text-sm text-gray-500">∞</span>
                            ) : product.stock <= 0 ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Out
                              </span>
                            ) : product.stock <= 3 ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                {product.stock}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-900">{product.stock}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.views || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Orders List */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Orders ({orders.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id || order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">
                        #{(order._id || order.id).toString().slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                        <div className="text-xs text-gray-500">{order.customer.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.map((item, i) => (
                            <div key={i}>
                              {item.quantity}x {item.name} {item.variant ? `(${item.variant.option})` : ''}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {order.total} MAD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value)}
                          className={`text-sm font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin

