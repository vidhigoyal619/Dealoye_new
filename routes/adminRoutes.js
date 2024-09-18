// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../src/models/product'); // Ensure correct path
const Requirement = require('../src/models/Requirement'); // Ensure correct path

// Middleware to check if the user is authenticated and is an admin
// You might need to adjust this based on your authentication setup
const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAdmin) { // Adjust as per your session structure
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admins only' });
    }
};

// Apply the middleware to all admin routes
router.use(isAdmin);

// Fetch the total number of requirements uploaded
router.get('/requirements', async (req, res) => {
    try {
        const count = await Requirement.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching requirements:', error);
        res.status(500).json({ message: 'Error fetching requirements data' });
    }
});

// Fetch product categories and their counts
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Optional: Sort categories by count descending
        ]);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories data' });
    }
});

// Fetch the total number of items sold
router.get('/items-sold', async (req, res) => {
    try {
        const count = await Product.countDocuments({ availability: 'Not Available' }); // Adjust based on your schema
        res.json({ count });
    } catch (error) {
        console.error('Error fetching items sold:', error);
        res.status(500).json({ message: 'Error fetching items sold data' });
    }
});

module.exports = router;
