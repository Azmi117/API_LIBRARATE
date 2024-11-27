const reviewController = require('../controllers/reviewController');
const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');

router.get('/:id', authenticate, reviewController.getAllReview);
router.post('/create/:id', authenticate, reviewController.createReview);
router.put('/update/:id', authenticate, reviewController.updateReview);
router.delete('/delete/:id', authenticate, reviewController.deleteReview);

module.exports = router;