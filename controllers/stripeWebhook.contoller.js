// controllers/stripeWebhookController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handlePaymentIntentSucceeded = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Agrega aquí la lógica para registrar en tu base de datos Oracle
    // los datos del `paymentIntent`, como id_transaccion, monto_pago, etc.
    // Ejemplo:
    // const { id, amount_received, currency, metadata } = paymentIntent;

    // await savePaymentToDatabase({
    //   id_transaccion: id,
    //   monto_pago: amount_received / 100, // Asume que el monto es en centavos
    //   metodo_pago: 'Stripe',
    //   estado_pago: 'Completado',
    //   fecha_pago: new Date(),
    //   // Otros campos según lo requieras
    // });

    console.log('Payment intent succeeded:', paymentIntent);
    res.status(200).json({ received: true });
  } else {
    res.status(400).end();
  }
};

module.exports = { handlePaymentIntentSucceeded };
