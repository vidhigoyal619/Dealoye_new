const express = require('express');
const router = express.Router();
const Product = require('../src/models/product'); // Assuming you have a Product model

// Fetch products based on category and query
router.get('/products', async (req, res) => {
    try {
        const { category, query } = req.query;
        let filter = {};

        // If category is not "Any", filter by category
        if (category && category !== 'Any') {
            filter.category = category;
        }

        // If there's a search query, filter by name or description
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server error');
    }
});


router.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});
module.exports = router;
