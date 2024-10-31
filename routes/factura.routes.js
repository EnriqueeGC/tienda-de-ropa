const express = require('express');
const facturaController = require('../controllers/factura.controller');

const router = express.Router();

router.get('/:id_pedido', facturaController.createFacturaPDF);

module.exports = router;