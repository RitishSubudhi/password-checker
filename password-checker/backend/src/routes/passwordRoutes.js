const express = require('express');
const router = express.Router();
const { checkPassword, healthCheck } = require('../controllers/passwordController');

router.post('/check', checkPassword);
router.get('/health', healthCheck);

module.exports = router;
