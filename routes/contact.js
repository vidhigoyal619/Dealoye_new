const express = require('express');
const router = express.Router();
const ProductDetails = require('../src/models/product');


// API Route to get a product by ID
router.get('/api/products/:id', async (req, res) => {
    try {
        const product = await ProductDetails.findById(req.params.id); // Use ProductDetails instead of Product
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
