const express = require('express');
const BookReview = require('../models/Review'); // Đổi tên biến để tránh xung đột
const LibraryReview = require('../models/LibraryReview');
const router = express.Router();

// Lấy tất cả review cho một cuốn sách
router.get('/reviews/:bookId', async (req, res) => {
    try {
        const reviews = await BookReview.find({ bookId: req.params.bookId }).populate('userId', 'username');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm một review mới cho sách
router.post('/reviews', async (req, res) => {
    const { bookId, userId, comment } = req.body;

    try {
        const newReview = new BookReview({
            bookId,
            userId,
            comment
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Lấy tất cả review của thư viện
router.get('/library-reviews', async (req, res) => {
    try {
        const reviews = await LibraryReview.find().populate('userId', 'username');
        res.status(200).json(reviews);
    } catch (err) {
        console.error('Error fetching library reviews:', err);
        res.status(500).json({ error: err.message });
    }
});

// Thêm một review mới cho thư viện
router.post('/libraryreviews', async (req, res) => {
    const { userId, comment } = req.body;

    if (!userId || !comment) {
        return res.status(400).json({ error: 'UserId and comment are required' });
    }

    try {
        const newReview = new LibraryReview({
            userId,
            comment
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        console.error('Error saving library review:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
