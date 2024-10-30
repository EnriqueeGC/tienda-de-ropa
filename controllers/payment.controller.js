const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;
    
        // Validar el monto
        if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
        }
    
        const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir a centavos
        currency: 'usd',
        });
    
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

const config = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
}

module.exports = {
    createPaymentIntent,
    config
}
