const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/db.js');

const registerPayment = async (id_pedido, paymentIntent) => {
    const {id: id_transaccion, amount_received, currency} = paymentIntent;
    const monto_pago = amount_received / 100;
    console.log('Payment received:', monto_pago, currency, id_transaccion);
    try {
        const query = `INSERT INTO PAGO (ID_PEDIDO, METODO_PAGO, ESTADO_PAGO, MONTO_PAGO, ID_TRANSACCION, FECHA_PAGO) VALUES (:id_pedido, :metodo_pago, :estado_pago, :monto_pago, :id_transaccion, SYSDATE)`;
        const params = {
            id_pedido,
            metodo_pago: 'Stripe',
            estado_pago: 'Completado',
            monto_pago,
            id_transaccion
        };
        const result = await db.executeQuery(query, params);

        console.log('Payment registered:', result);
    } catch (error) {
        console.error('Error registering payment:', error);
    }
};

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, id_pedido } = req.body;

        // Validar el monto e id_pedido
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (!id_pedido) {
            return res.status(400).json({ error: 'Missing id_pedido' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'usd',
            metadata: { id_pedido }, // Añadir id_pedido en los metadatos
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const config = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
}

module.exports = {
    registerPayment,
    createPaymentIntent,
    config
}
