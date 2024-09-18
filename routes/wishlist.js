// wishlist.js (in routes folder)
const express = require('express');
const router = express.Router();
const Wishlist = require('../src/models/wishlist');

// Route to display wishlist items
router.get('/wishlist', async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming you have user authentication
        const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');

        res.render('wishlist', {
            title: 'Your Wishlist',
            products: wishlist ? wishlist.products : []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to add an item to the wishlist
router.post('/wishlist/add', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { productId } = req.body;

        if (!userId) {
            return res.status(401).send("Unauthorized: User is not logged in.");
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        wishlist.products.push({ productId });
        await wishlist.save();

        res.redirect('/wishlist');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to remove an item from the wishlist
router.post('/wishlist/remove', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { productId } = req.body;

        if (!userId) {
            return res.status(401).send("Unauthorized: User is not logged in.");
        }

        await Wishlist.updateOne(
            { userId },
            { $pull: { products: { productId } } }
        );

        res.redirect('/wishlist');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/api/wishlist', async (req, res) => {
    try {
        const userId = req.session.userId;
        const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');

        if (wishlist) {
            res.render('partials/wishlist-content', {
                layout: false,  // Render only the content, not the full layout
                products: wishlist.products
            });
        } else {
            res.send('<p>Your wishlist is empty.</p>');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('<p>Error loading wishlist data.</p>');
    }
});


module.exports = router;
