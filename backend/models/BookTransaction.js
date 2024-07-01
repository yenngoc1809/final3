const mongoose = require("mongoose");

const BookTransactionSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Assuming your model is named 'User'
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    borrowerName: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['Issued', 'Reserved'] // Valid transaction types
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    transactionStatus: {
        type: String,
        default: "Active",
        enum: ['Active', 'Completed', 'Cancelled'] // Valid transaction statuses
    }
},
    {
        timestamps: true // Automatically add createdAt and updatedAt fields
    });

module.exports = mongoose.model('BookTransaction', BookTransactionSchema);
