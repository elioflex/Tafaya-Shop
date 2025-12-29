const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    images: [{
        type: String
    }],
    category: {
        type: String,
        required: true,
        default: 'Ashtrays'
    },
    tags: [{
        type: String
    }],
    stock: {
        type: Number,
        default: null
    },
    views: {
        type: Number,
        default: 0
    },
    variants: [{
        name: String,
        options: [{
            value: String,
            priceModifier: Number,
            stock: Number
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

module.exports = mongoose.model('Product', productSchema)
