const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     fullname:{
//         type: String,
//         required: true
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true,
//     },
//     phone:{
//         type: String, 
//         required: true
//     },
//     password:{
//         type: String,
//         required: true,
        
//     },
//     role:{
//         type: String,
//         required: true
//     },
//     ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetails' }],
//     cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }]
//   });

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',  // Default role is 'user'
        enum: ['user', 'admin'],  // Ensures only valid roles are accepted
        required: true
    },
    ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetails' }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }]
});

  const UserDetail = mongoose.model ("UserDetail", userSchema);
  module.exports = UserDetail;