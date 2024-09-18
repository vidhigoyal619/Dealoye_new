// models/Requirement.js

const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetail',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
