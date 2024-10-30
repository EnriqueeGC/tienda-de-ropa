// routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/payment.controller.js');
const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.get('/config', paymentController.config);
router.post('/register-payment/:id_pedido', paymentController.registerPayment);

module.exports = router;
