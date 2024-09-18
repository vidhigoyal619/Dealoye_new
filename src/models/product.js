const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    contact: { type: String, required: true },
    condition: { type: String, required: true },
    category: { type: String, required: true, enum: ['Books', 'Fashion', 'Electronics', 'Craft Supplies', 'Home Appliances', 'Toys', 'Sports Equipment', 'Art Supplies', 'Accessories'] },
    brand: { type: String, required: true },
    color: { type: String },
    images: { type: [String], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetail', required: true },
    featured: { type: Boolean, default: false },
    availability: {
        type: String,
        enum: ['Available', 'Not Available'],
        default: 'Available'
      }, // New field for availability status
});

const ProductDetails = mongoose.model('Product', productSchema);
module.exports = ProductDetails;
