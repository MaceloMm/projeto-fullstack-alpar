const express = require('express');
const router = express.Router();
const SingUpUser = require('../controllers/SingUpController');
router.post('/cadastrar', SingUpUser.singUp);
module.exports = router;