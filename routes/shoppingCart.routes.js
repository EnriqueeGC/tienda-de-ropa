const express = require('express');
const shoppingCartController = require('../controllers/shoppingCart.controller.js');

const router = express.Router();

router.post('/add', shoppingCartController.addToCart);
router.get('/getCartDetails/:id_usuario', shoppingCartController.getCartDetails);
router.put('/update', shoppingCartController.updateCartItem);
router.delete('/deleteCartItem', shoppingCartController.deleteCartItem);
router.delete('/deleteCart/:id_usuario', shoppingCartController.deleteCart);
router.get('/mostSoldProducts', shoppingCartController.getMostSoldProducts);

module.exports = router;

