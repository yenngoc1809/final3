const express = require("express");
const Book = require("../models/Book.js");
const BookCategory = require("../models/BookCategory.js");
const Request = require('../models/Request.js');
const User = require('../models/Users.js');
const BookTransaction = require('../models/BookTransaction.js'); // Import BookTransaction model
const router = express.Router();
const cors = require("cors");

// Allow CORS
router.use(cors());

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 }).exec();
        books.forEach(book => book.calculateAvailableCopies());
        res.status(200).json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        return res.status(500).json({ message: "Failed to fetch books", error: err.message });
    }
});

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions").exec();
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (err) {
        console.error("Error fetching book:", err);
        return res.status(500).json({ message: "Error fetching book", error: err.message });
    }
});

/* Get books by category name */
router.get("/", async (req, res) => {
    const category = req.query.category;
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books").exec();
        if (!books) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(books);
    } catch (err) {
        console.error("Error fetching category books:", err);
        return res.status(500).json({ message: "Error fetching category books", error: err.message });
    }
});

/* Adding book */
router.post("/addbook", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            console.log("Received request to add book:", req.body);

            const newbook = new Book({
                bookName: req.body.bookName,
                alternateTitle: req.body.alternateTitle,
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                language: req.body.language,
                publisher: req.body.publisher,
                coverImage: req.body.coverImageLink,
                categories: req.body.categories
            });

            console.log("Saving new book to database");
            const book = await newbook.save();
            console.log("Book saved:", book);

            console.log("Updating book categories");
            await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
            console.log("Categories updated");

            res.status(200).json(book);
        } catch (err) {
            console.error("Error adding book:", err);
            res.status(500).json({ message: "Error adding book", error: err.message });
        }
    } else {
        console.log("Permission denied for adding book");
        return res.status(403).json("You don't have permission to add a book!");
    }
});

/* Updating book */
router.put("/updatebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const book = await Book.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true }).exec();
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.status(200).json({ message: "Book details updated successfully", book });
        } catch (err) {
            console.error("Error updating book:", err);
            res.status(500).json({ message: "Error updating book", error: err.message });
        }
    } else {
        return res.status(403).json("You don't have permission to update a book!");
    }
});

/* Remove book */
router.delete("/removebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const book = await Book.findById(req.params.id).exec();
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            await book.remove();
            await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
            res.status(200).json("Book has been deleted");
        } catch (err) {
            console.error("Error deleting book:", err);
            return res.status(500).json({ message: "Error deleting book", error: err.message });
        }
    } else {
        return res.status(403).json("You don't have permission to delete a book!");
    }
});

/* Get recently added books */
router.get("/recentbooks", async (req, res) => {
    try {
        const recentBooks = await Book.find({}).sort({ createdAt: -1 }).limit(10).exec();
        res.status(200).json(recentBooks);
    } catch (err) {
        console.error("Error fetching recent books:", err);
        return res.status(500).json({ message: "Error fetching recent books", error: err.message });
    }
});

/* Get random books */
router.get("/randombooks", async (req, res) => {
    try {
        const books = await Book.aggregate([{ $sample: { size: 10 } }]);
        res.status(200).json(books);
    } catch (err) {
        console.error("Error fetching random books:", err);
        return res.status(500).json({ message: "Failed to fetch random books", error: err.message });
    }
});

/* Search books */
router.get("/search", async (req, res) => {
    const searchQuery = req.query.query;
    try {
        const books = await Book.find({
            $or: [
                { bookName: { $regex: searchQuery, $options: 'i' } },
                { author: { $regex: searchQuery, $options: 'i' } },
                { alternateTitle: { $regex: searchQuery, $options: 'i' } }
            ]
        }).populate("transactions").exec();
        res.status(200).json(books);
    } catch (err) {
        console.error("Error searching books:", err);
        return res.status(500).json({ message: "Error searching books", error: err.message });
    }
});

/* Create a request */
router.post('/request', async (req, res) => {
    console.log('Received request body:', req.body);
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
        return res.status(400).send({ error: 'Book ID and User ID are required' });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const request = new Request({
            book: bookId,
            userId: userId,
            status: 'Pending'
        });

        await request.save();
        res.status(201).send({ message: 'Request sent successfully!', request });
    } catch (err) {
        console.error('Error in handling request:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/* Get all requests for a user */
router.get('/requests/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log('Fetching requests for user:', userId);

    try {
        const requests = await Request.find({ userId }).populate('book');
        console.log('Requests found:', requests);
        res.status(200).send(requests);
    } catch (err) {
        console.error('Error in fetching requests:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/* Get all requests */
router.get('/requests', async (req, res) => {
    console.log('Fetching all requests');

    try {
        const requests = await Request.find().populate('book userId');
        console.log('Requests found:', requests);
        res.status(200).send(requests);
    } catch (err) {
        console.error('Error in fetching all requests:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/* Check if a request exists */
router.get('/request/check/:userId/:bookId', async (req, res) => {
    const { userId, bookId } = req.params;
    try {
        const request = await Request.findOne({ userId, book: bookId });
        if (request) {
            res.status(200).json({ exists: true, requestId: request._id });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking request:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/* Cancel a request */
router.delete('/request/cancel/:requestId', async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await Request.findByIdAndDelete(requestId);
        if (request) {
            res.status(200).json({ message: 'Request canceled successfully' });
        } else {
            res.status(404).json({ error: 'Request not found' });
        }
    } catch (err) {
        console.error('Error canceling request:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/* Accept a request and create a transaction */
router.post('/request/accept/:requestId', async (req, res) => {
    if (!req.body.isAdmin) {
        return res.status(403).json("You don't have permission to accept a request");
    }

    const { requestId } = req.params;
    try {
        const request = await Request.findById(requestId).populate('book userId');
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const book = await Book.findById(request.book._id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        let transactionType = 'Issued';
        let fromDate = new Date();
        let toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // One week from now

        if (book.bookCountAvailable <= 0) {
            return res.status(400).json({ error: 'Book not available' });
        }

        const transaction = new BookTransaction({
            bookId: request.book._id,
            borrowerId: request.userId._id,
            bookName: request.book.bookName,
            borrowerName: request.userId.userFullName,
            transactionType,
            fromDate,
            toDate
        });

        await transaction.save();

        await book.updateOne({ $push: { transactions: transaction._id }, $inc: { bookCountAvailable: -1 } });
        await User.findByIdAndUpdate(request.userId._id, { $push: { activeTransactions: transaction._id } });
        await Request.findByIdAndDelete(requestId);

        res.status(200).json({ message: 'Request accepted and transaction created successfully', transaction });
    } catch (err) {
        console.error('Error in accepting request:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;
