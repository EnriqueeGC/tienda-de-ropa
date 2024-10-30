const express = require('express');
const router = express.Router();
const orderControlelr = require('../controllers/order.controller.js');

router.post('/createPedido', orderControlelr.createPedido);
router.post('/pedido', orderControlelr.createOrder);
router.get('/pedido/:id_usuario/:id_pedido', orderControlelr.getOrderDetails);

module.exports = router;