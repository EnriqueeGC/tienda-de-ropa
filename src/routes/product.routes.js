const express = require('express');
const productController = require('../controllers/product.controller.js');
const productMiddleware = require('../middlewares/product.middleware.js');
const { upload } = require('../config/cloudinary.js');

const router = express.Router();

router.post('/create', upload.single('image'), productController.createProduct);
router.get('/getAll', productController.findAll);
router.get('/getProductById/:id', productController.findProductById);
router.get('/findBySubcategoryId/:id', productController.findBySubcategoryId);
router.put('/updateProductById/:id', upload.single('image'), productController.updateProduct);
router.delete('/deleteProductById/:id', productController.deleteProduct);

module.exports = router;