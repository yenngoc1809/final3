const express = require('express');
const BookCategory = require('../models/BookCategory.js');
const router = express.Router();
//done
// Middleware to log request times
router.use((req, res, next) => {
  console.time(`Request Time - ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.timeEnd(`Request Time - ${req.method} ${req.url}`);
  });
  next();
});

// Route to get all categories
router.get('/allcategories', async (req, res) => {
  try {
    const categories = await BookCategory.find({});
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

// Route to add a new category
router.post('/addcategory', async (req, res) => {
  try {
    const newCategory = new BookCategory({
      categoryName: req.body.categoryName,
    });
    const category = await newCategory.save();
    res.status(200).json(category);
  } catch (err) {
    console.error('Error adding category:', err);
    return res.status(500).json({ error: 'Failed to add category', details: err.message });
  }
});

module.exports = router;
