const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const {authenticate} = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

router.get('/', authenticate, bookController.getAllBooks);
router.post('/create', authenticate, upload.single('photo'), bookController.createBook);
router.put('/update/:id', authenticate, upload.single('photo'), bookController.updateBook);
router.delete('/delete/:id', authenticate, bookController.deleteBook);
router.get('/:id', authenticate, bookController.getBookById);

module.exports = router;