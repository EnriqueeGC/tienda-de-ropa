// routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/payment.controller.js');
const router = express.Router();


router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.get('/config', paymentController.config);

module.exports = router;
