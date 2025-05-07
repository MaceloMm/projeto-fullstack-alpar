const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadImagem')
const ProductController = require('../controllers/ProductController');
const verificarToken = require('../middlewares/auth.middleware');
router.get('/', ProductController.list);
router.post('/', verificarToken, upload.single('image'), ProductController.create);
module.exports = router;
