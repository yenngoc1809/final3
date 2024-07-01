const express = require('express');
const Book = require("../models/Book.js");
const User = require("../models/Users.js");
const BookTransaction = require("../models/BookTransaction.js");
const router = express.Router();

router.post("/add-transaction", async (req, res) => {
    try {
        if (req.body.isAdmin === true) {
            const newTransaction = new BookTransaction({
                bookId: req.body.bookId,
                borrowerId: req.body.borrowerId,
                bookName: req.body.bookName,
                borrowerName: req.body.borrowerName,
                transactionType: req.body.transactionType,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate
            });
            const transaction = await newTransaction.save();
            const book = await Book.findById(req.body.bookId);

            if (book) {
                await book.updateOne({ $push: { transactions: transaction._id } });
                await User.findByIdAndUpdate(req.body.borrowerId, { $push: { activeTransactions: transaction._id } });
                res.status(200).json(transaction);
            } else {
                res.status(404).json("Book not found");
            }
        } else {
            res.status(403).json("You are not allowed to add a transaction");
        }
    } catch (err) {
        console.error("Error in adding transaction:", err); // Logging error
        res.status(500).json(err.message);
    }
});

router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({}).sort({ _id: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

router.put("/update-transaction/:id", async (req, res) => {
    try {
        if (req.body.isAdmin) {
            const updatedTransaction = await BookTransaction.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });

            if (updatedTransaction) {
                // res.status(200).json("Transaction details updated successfully");
                res.status(200).json(updatedTransaction);
            } else {
                res.status(404).json("Transaction not found");
            }
        } else {
            res.status(403).json("You are not allowed to update this transaction");
        }
    } catch (err) {
        console.error("Error in updating transaction:", err);
        res.status(500).json(err.message);
    }
});

router.delete("/remove-transaction/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const transaction = await BookTransaction.findByIdAndDelete(req.params.id);
            if (transaction) {
                const book = await Book.findById(transaction.bookId);
                if (book) {
                    await book.updateOne({ $pull: { transactions: req.params.id } });
                }
                await User.findByIdAndUpdate(transaction.borrowerId, { $pull: { activeTransactions: req.params.id } });
                res.status(200).json("Transaction deleted successfully");
            } else {
                res.status(404).json("Transaction not found");
            }
        } catch (err) {
            res.status(500).json(err.message);
        }
    } else {
        res.status(403).json("You don't have permission to delete this transaction");
    }
});

router.put("/users/:id/move-to-activetransactions", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json("User not found");
            }
            user.activeTransactions.push(req.body.transactionId);
            await user.save();
            res.status(200).json("Transaction moved to active transactions");
        } catch (err) {
            console.error("Error moving to active transactions:", err); // Logging error
            res.status(500).json(err.message);
        }
    } else {
        res.status(403).json("You are not allowed to perform this action");
    }
});

module.exports = router;
