const express = require('express');
const router = express.Router();
const orderControlelr = require('../controllers/order.controller.js');

router.post('/createPedido', orderControlelr.createPedido);
router.post('/pedido', orderControlelr.createOrder);

module.exports = router;