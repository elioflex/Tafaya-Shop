# Tafaya Shop - Handmade Custom Ashtrays

A beautiful e-commerce website for handmade custom ashtrays with WhatsApp integration for direct customer orders.

## Features

- 🛍️ **Product Gallery** - Showcase your handmade ashtrays
- 📱 **WhatsApp Integration** - Customers can order directly via WhatsApp
- 🎨 **Customization Options** - Customers can customize size, color, and design
- 🔧 **Admin Panel** - Easy product management (add, edit, delete products)
- 📸 **Image Upload** - Upload product images or use URLs
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Built with React and TailwindCSS

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

You need to run both the frontend and backend:

### Terminal 1 - Backend Server:
```bash
npm run server
```
This starts the API server on http://localhost:5000

### Terminal 2 - Frontend Development Server:
```bash
npm run dev
```
This starts the frontend on http://localhost:3000

## Usage

### Customer View
1. Visit http://localhost:3000
2. Browse products
3. Click on a product to see details
4. Customize your order (size, color, design)
5. Click "Order on WhatsApp" to send your order via WhatsApp

### Admin Panel
1. Visit http://localhost:3000/admin
2. Add new products with images, descriptions, and prices
3. Edit or delete existing products
4. Upload product images or use image URLs

## WhatsApp Configuration

The WhatsApp number is configured to: **+212 6 84 04 85 74**

To change it, update the phone number in:
- `src/pages/Home.jsx` (line 22)
- `src/pages/ProductDetail.jsx` (line 38)

## Project Structure

```
tfaya-shop/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Main shop page
│   │   ├── ProductDetail.jsx # Product detail with customization
│   │   └── Admin.jsx         # Admin panel for product management
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── index.js              # Express API server
│   ├── products.json         # Product database
│   └── uploads/              # Uploaded images
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: React, React Router, TailwindCSS, Lucide Icons
- **Backend**: Express.js, Multer (file uploads)
- **Database**: JSON file storage (simple and effective)

## Deployment

For production deployment, you can:
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to any static hosting (Netlify, Vercel, etc.)
3. Deploy the `server` folder to a Node.js hosting service (Heroku, Railway, etc.)

## Support

For any issues or questions, contact via WhatsApp: +212 6 84 04 85 74
