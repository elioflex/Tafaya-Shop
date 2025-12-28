require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const Product = require('./models/Product')

const app = express()
const PORT = process.env.PORT || 5001

// Validate required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'ADMIN_PASSWORD', 'JWT_SECRET', 'MONGODB_URI']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '))
  console.error('Please create a .env file based on .env.example')
  process.exit(1)
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors())
app.use(express.json())

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' })
    }
    req.user = user
    next()
  })
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, message: 'Login successful' })
})

// Verify token
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// Public: Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    // Map _id to id for frontend compatibility
    const mapped = products.map(p => ({ ...p.toObject(), id: p._id.toString() }))
    res.json(mapped)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Public: Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json({ ...product.toObject(), id: product._id.toString() })
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(404).json({ error: 'Product not found' })
  }
})

// Public: Track product view
app.post('/api/products/:id/view', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (product) {
      res.json({ views: product.views })
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    console.error('Error tracking view:', error)
    res.status(404).json({ error: 'Product not found' })
  }
})

// Protected: Create product
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      stock: req.body.stock !== '' ? req.body.stock : null
    }
    const product = new Product(productData)
    await product.save()
    res.status(201).json({ ...product.toObject(), id: product._id.toString() })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Protected: Update product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      stock: req.body.stock !== '' ? req.body.stock : null,
      updatedAt: new Date()
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (product) {
      res.json({ ...product.toObject(), id: product._id.toString() })
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Protected: Delete product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (product) {
      res.json({ message: 'Product deleted successfully' })
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Protected: Upload image
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  console.log('Upload request received')

  if (!req.file) {
    console.error('No file in request')
    return res.status(400).json({ error: 'No file uploaded' })
  }

  console.log('File received:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  })

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'tafaya-shop',
        resource_type: 'image',
        public_id: `product_${Date.now()}`
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          return res.status(500).json({ error: 'Failed to upload image', details: error.message })
        }
        console.log('Upload successful:', result.secure_url)
        res.json({ imageUrl: result.secure_url })
      }
    )

    uploadStream.end(req.file.buffer)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload image', details: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
