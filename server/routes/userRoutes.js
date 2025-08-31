const express = require('express');
const { register, login, profile ,getAllUsers} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.get('/', getAllUsers);

module.exports = router;
