const express = require('express');
const invoiceController = require('../controllers/invoice.controller');

const router = express.Router();

router.get('/:id_pedido', invoiceController.createFacturaPDF);
module.exports = router;