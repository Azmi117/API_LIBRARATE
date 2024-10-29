const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const bookRoutes = require('./bookRoutes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/book', bookRoutes);

module.exports = router;