// models/Request.js

const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to Book model
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // Reference to User model (assuming user authentication)
    status: { type: String, default: 'Pending' }, // Status of the request
    notification: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
