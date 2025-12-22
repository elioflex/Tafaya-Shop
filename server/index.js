const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const cloudinary = require('cloudinary').v2

const app = express()
const PORT = 5001

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyztnskbj',
  api_key: process.env.CLOUDINARY_API_KEY || '229784152581655',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'PZ1X-ZXD2-0wwVpoBY9wpGuOvqY'
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

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

app.get('/api/products', (req, res) => {
  const products = loadProducts()
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const products = loadProducts()
  const product = products.find(p => p.id === req.params.id)
  
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

app.post('/api/products', (req, res) => {
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

app.put('/api/products/:id', (req, res) => {
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

app.delete('/api/products/:id', (req, res) => {
  const products = loadProducts()
  const filteredProducts = products.filter(p => p.id !== req.params.id)
  
  if (filteredProducts.length < products.length) {
    saveProducts(filteredProducts)
    res.json({ message: 'Product deleted successfully' })
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

app.post('/api/upload', upload.single('image'), async (req, res) => {
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
  
  console.log('Cloudinary config:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key,
    has_secret: !!cloudinary.config().api_secret
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
