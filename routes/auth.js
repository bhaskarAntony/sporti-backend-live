const express = require('express');
const { register, login, validateToken } = require('../controllers/auth');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validateToken', authenticateToken, validateToken);

module.exports = router;
