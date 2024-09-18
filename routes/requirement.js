// routes/requirements.js

const express = require('express');
const router = express.Router();
const Requirement = require('../src/models/Requirement');

//Route to fetch requirements
router.get('/api/user-requirements', async (req, res) => {
    try {
        const requirements = await Requirement.find().populate('user', 'fullname email phone'); // Populating user details
        res.status(200).json(requirements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requirements', error });
    }
});

router.get('/api/requirements', async (req, res) => {
    try {
        const userId = req.session.userId;  // Ensure user session is set
        const requirements = await Requirement.find({ user: userId });

        if (requirements.length > 0) {
            res.render('partials/requirements-content', {
                layout: false,  // Render only the content, not the full layout
                requirements  // Send the fetched requirements to the template
            });
        } else {
            res.send('<p>You have no requirements listed.</p>');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('<p>Error loading requirements data.</p>');
    }
});





module.exports = router;
