require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 5001

// Validate required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'ADMIN_PASSWORD', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '))
  console.error('Please create a .env file based on .env.example')
  process.exit(1)
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

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

const dataFile = path.join(__dirname, 'products.json')

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

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

const loadProducts = () => {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading products:', error)
  }
  return []
}

const saveProducts = (products) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2))
  } catch (error) {
    console.error('Error saving products:', error)
  }
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

  // Generate JWT token (expires in 24 hours)
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' })

  res.json({ token, message: 'Login successful' })
})

// Verify token
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// Public: Get all products
app.get('/api/products', (req, res) => {
  const products = loadProducts()
  res.json(products)
})

// Public: Get single product
app.get('/api/products/:id', (req, res) => {
  const products = loadProducts()
  const product = products.find(p => p.id === req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

// Public: Track product view
app.post('/api/products/:id/view', (req, res) => {
  const products = loadProducts()
  const index = products.findIndex(p => p.id === req.params.id)

  if (index !== -1) {
    products[index].views = (products[index].views || 0) + 1
    saveProducts(products)
    res.json({ views: products[index].views })
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})


// Protected: Create product
app.post('/api/products', authenticateToken, (req, res) => {
  const products = loadProducts()
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  }

  products.push(newProduct)
  saveProducts(products)
  res.status(201).json(newProduct)
})

// Protected: Update product
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const products = loadProducts()
  const index = products.findIndex(p => p.id === req.params.id)

  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    saveProducts(products)
    res.json(products[index])
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

// Protected: Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const products = loadProducts()
  const filteredProducts = products.filter(p => p.id !== req.params.id)

  if (filteredProducts.length < products.length) {
    saveProducts(filteredProducts)
    res.json({ message: 'Product deleted successfully' })
  } else {
    res.status(404).json({ error: 'Product not found' })
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

