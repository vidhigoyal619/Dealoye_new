const express = require('express');
const router = express.Router();
const Cart = require('../src/models/cart');
const Product = require('../src/models/product');

// Add product to cart
router.get('/api/cart', async (req, res) => {
    try {
        const userId = req.session.userId; // Ensure userId is retrieved from session

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (!cart) {
            return res.json({ products: [] }); // Return empty array if cart is empty
        }

        const products = cart.products.map(item => ({
            _id: item.productId._id,
            image: item.productId.images[0],
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
        }));

        res.json({ products });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch cart items
router.get('/cart', async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming userId is stored in session

        if (!userId) {
            return res.redirect('/login'); // Redirect to login if user is not authenticated
        }

        // Fetch cart and populate product details
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (!cart) {
            return res.render('cart', { products: [] }); // Render empty cart if no cart found
        }

        // Extract product details and include quantity
        const products = cart.products.map(item => ({
            ...item.productId._doc, // Spread product fields
            quantity: item.quantity // Add quantity info
        }));

        res.render('cart', { products });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add product to cart
router.post('/api/cart/add', async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming userId is stored in session
        const { productId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ userId, products: [] });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(product => product.productId.toString() === productId);

        if (existingProductIndex > -1) {
            // If the product exists, update its quantity
            cart.products[existingProductIndex].quantity += quantity ? quantity : 1;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.products.push({ productId, quantity: quantity ? quantity : 1 });
        }

        await cart.save();

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove product from cart (optional)
router.post('/api/cart/remove', async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.userId; // Assuming userId is stored in session

        if (!userId) {
            return res.status(401).send('User not authenticated');
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        cart.products = cart.products.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).send('Product removed from cart');
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update product quantity in cart
router.post('/api/cart/update', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return res.status(200).json({ message: 'Cart updated successfully' });
        } else {
            return res.status(404).json({ error: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Checkout route
router.get('/checkout', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    res.render('checkout'); // Render your checkout page
});


module.exports = router;
