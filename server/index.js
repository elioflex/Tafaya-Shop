const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 5001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

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

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ imageUrl })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
