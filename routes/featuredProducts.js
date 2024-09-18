const express = require('express');
const router = express.Router();
const ProductDetails = require('../src/models/product'); // Adjust the path as necessary

// Route to get featured products
router.get('/api/featured-products', async (req, res) => {
    try {
        const featuredProducts = await ProductDetails.find({ featured: true });
        res.json(featuredProducts);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
