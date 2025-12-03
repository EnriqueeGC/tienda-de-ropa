const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/db.js');
const Payment = db.Payments;

exports.registerPayment = async (id_pedido, paymentIntent) => {

    try {
        const { id: id_transaccion, amount_received, currency } = paymentIntent;
        const monto_pago = amount_received / 100;

        const newPayment = await Payment.create({
            id_pedido,
            metodo_pago: 'Stripe',
            estado_pago: 'Completado',
            monto_pago,
            id_transaccion
        });

        res.status(201).json({
            message: 'Payment registered successfully',
            payment: newPayment
        });
    } catch (error) {
        console.error('Error registering payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createPaymentIntent = async (req, res) => {
    const { amount, id_pedido } = req.body;
    
    try {
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        if (!id_pedido) {
            return res.status(400).json({ message: 'Missing id_pedido' });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: { id_pedido },
        });
        
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.config = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};
