// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { handlePaymentIntentSucceeded } = require('../controllers/stripeWebhook.contoller.js');

// Ruta del webhook de Stripe
router.post('/stripe', handlePaymentIntentSucceeded);

module.exports = router;
