const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate, authorize} = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

router.get('/', authenticate, userController.getAllUser);
router.get('/me', authenticate, userController.getOneUser);
router.get('/:id', authenticate, userController.getUserById);
router.put('/update/:id', authenticate, upload.single('photo'), userController.updateUser);
router.delete('/delete/:id', authenticate, userController.deleteUser);

module.exports = router;