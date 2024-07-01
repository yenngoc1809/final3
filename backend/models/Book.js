const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    alternateTitle: { type: String },
    author: { type: String, required: true },
    bookCountAvailable: { type: Number, required: true },
    language: { type: String },
    publisher: { type: String },
    coverImage: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookCategory' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookTransaction' }]
}, { timestamps: true });

BookSchema.methods.calculateAvailableCopies = function () {
    const borrowedCopies = this.transactions.reduce((count, transaction) => {
        if (transaction.transactionStatus === 'Active' && transaction.transactionType === 'Issue') {
            return count + 1;
        }
        return count;
    }, 0);
    this.bookCountAvailable -= borrowedCopies;
};

module.exports = mongoose.model('Book', BookSchema);
