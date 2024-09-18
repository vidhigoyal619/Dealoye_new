const express = require('express');
const router = express.Router();
const Product = require('../src/models/product');

// Route to display all products on the products page
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products', { products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
