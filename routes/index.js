const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const bookRoutes = require('./bookRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/book', bookRoutes);
router.use('/review', reviewRoutes);

module.exports = router;