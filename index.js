require('dotenv').config();
const express = require('express');
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
const paymentRoutes = require('./routes/payment.routes.js');
const webhookRoutes = require('./routes/webhook.routes.js'); 
const orderRoutes = require('./routes/order.routes.js');
const orderDetailsRoutes = require('./routes/orderDetails.routes.js');

const app = express();
const port = process.env.PORT || 3000;  // Usa el puerto de Render si está disponible, si no, el puerto 3000

app.use(cors());

app.use('/api/webhook', express.raw({ type: 'application/json' }));
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
app.use('/api/payment/', paymentRoutes); // incluye el endpoint de creacion de pago
app.use('/api/webhook/', webhookRoutes);
app.use('/api/order/', orderRoutes);
app.use('/api/orderDetails/', orderDetailsRoutes);
app.use('/api/', authRoutes); // inicio de sesion

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
