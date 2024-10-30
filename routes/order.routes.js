const express = require('express');
const router = express.Router();
const { createPedido } = require('../controllers/order.controller.js');

router.post('/createPedido', createPedido);

module.exports = router;