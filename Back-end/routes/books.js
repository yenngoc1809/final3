const express = require("express");
const Book = require("../models/Book.js");
const BookCategory = require("../models/BookCategory.js");
const router = express.Router();
const cors = require("cors");

// Allow CORS
router.use(cors());

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 }).exec();
        books.forEach(book => book.calculateAvailableCopies()); // Calculate available copies
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
                coverImage: req.body.coverImageLink, // Thêm ảnh bìa
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
            console.error("Error adding book:", err); // Log the error for debugging
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
        const recentBooks = await Book.find({}).sort({ createdAt: -1 }).limit(10).exec(); // Lấy 10 quyển sách mới nhất
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




module.exports = router;
