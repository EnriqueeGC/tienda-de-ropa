require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const userRoutes = require('./routes/user.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productRoutes = require('./routes/product.routes.js');
const discountRoutes = require('./routes/discount.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const sizesRoutes = require('./routes/sizes.routes.js');
const variantsProductRoutes = require('./routes/variantsProduct.routes.js');
const subCategoryRoutes = require('./routes/subCategory.routes.js');
const cartRoutes = require('./routes/shoppingCart.routes.js');

const app = express();
const port = process.env.PORT || 3000;  // Usa el puerto de Render si está disponible, si no, el puerto 3000

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/users/', userRoutes);
app.use('/api/categories/', categoryRoutes);
app.use('/api/products/', productRoutes);
app.use('/api/discounts/', discountRoutes);
app.use('/api/sizes/', sizesRoutes);
app.use('/api/variants/', variantsProductRoutes);
app.use('/api/subcategories/', subCategoryRoutes);
app.use('/api/cart/', cartRoutes);
app.use('/api/', authRoutes); // inicio de sesion

// Configuración de Stripe
app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Crear Payment Intent
app.post('/create-payment-intent', async (req, res) => {
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
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
