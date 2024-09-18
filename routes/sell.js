const express = require('express');
const router = express.Router();
const Product = require('../src/models/product');
const User = require('../src/models/user');

// Route to display products on the Sell page
router.get('/sell', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the DB
        res.render('sell', { products });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
});

router.post('/updateAvailability/:id', async (req, res) => {
    try {
        const { availability } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { availability });
        res.status(200).send("Availability updated");
    } catch (error) {
        res.status(500).send("Error updating availability");
    }
});

router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('Product ID:', productId);
        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (deletedProduct) {
            return res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting product' });
    }
});

// Route to get products posted by the logged-in user
router.get('/api/sell-items', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch products posted by the logged-in user
        const products = await Product.find({ user: userId });

        if (products.length > 0) {
            res.render('partials/sell-content', {
                layout: false,  // Render only the content, not the full layout
                products
            });
        } else {
            res.send('<p>No items found.</p>');
        }
    } catch (error) {
        console.error('Error fetching sell items:', error);
        res.status(500).send('<p>Error loading sell items data.</p>');
    }
});


module.exports = router;
