const express = require('express');
const router = express.Router();
const { createOrderDetails } = require('../controllers/orderDetails.controller.js');

router.post('/createOrderDetails/:id_pedido', createOrderDetails);

module.exports = router;