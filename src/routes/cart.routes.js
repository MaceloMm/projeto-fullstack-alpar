const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const verificarToken = require('../middlewares/auth.middleware');
router.get('/cart', verificarToken, CartController.list);
router.post('/cart', verificarToken, CartController.create);
router.put('/cart', verificarToken, CartController.putItem);
module.exports = router;