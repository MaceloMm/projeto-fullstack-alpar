const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const verificarToken = require('../middlewares/auth.middleware');
router.get('/', CartController.list);
router.post('/', verificarToken, CartController.create);
module.exports = router;