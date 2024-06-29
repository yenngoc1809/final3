const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Get all reviews for a book
router.get('/reviews/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId', 'username');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new review
router.post('/reviews', async (req, res) => {
    const { bookId, userId, comment } = req.body;

    try {
        const newReview = new Review({
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

module.exports = router;
