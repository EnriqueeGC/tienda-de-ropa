const express = require('express');
const productController = require('../controllers/product.controller.js');
const productMiddleware = require('../middlewares/product.middleware.js');

const router = express.Router();

router.post('/create', productMiddleware.validateArticle, productMiddleware.validateResults, productController.createProduct);
router.get('/getAll', productController.getAllProducts);
router.get('/getProductById/:id_producto', productController.getProductById);
router.get('/getProductByName', productController.getProductByName);
router.delete('/deleteProductById/:id_producto', productController.deleteProductById);
router.put('/updateProductById/:id_producto', productMiddleware.validateArticle, productMiddleware.validateResults, productController.updateProductById);

module.exports = router;