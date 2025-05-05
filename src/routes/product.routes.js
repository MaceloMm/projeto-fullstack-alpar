const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const verificarToken = require('../middlewares/auth.middleware');
router.get('/', ProductController.list);
router.post('/', verificarToken, ProductController.create);
module.exports = router;
