require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./app/config/db.js');

const userRoutes = require('./app/routes/user.routes.js');
const categoryRoutes = require('./app/routes/category.routes.js');
const productRoutes = require('./app/routes/product.routes.js');
const discountRoutes = require('./app/routes/discount.routes.js');
const authRoutes = require('./app/routes/auth.routes.js');
const sizesRoutes = require('./app/routes/sizes.routes.js');
const variantsProductRoutes = require('./app/routes/variantsProduct.routes.js');
const subCategoryRoutes = require('./app/routes/subCategory.routes.js');
const cartRoutes = require('./app/routes/shoppingCart.routes.js');
const paymentRoutes = require('./app/routes/payment.routes.js');
const webhookRoutes = require('./app/routes/webhook.routes.js'); 
const orderRoutes = require('./app/routes/order.routes.js');
const orderDetailsRoutes = require('./app/routes/orderDetails.routes.js');
const facturaRoutes = require('./app/routes/factura.routes.js');

const app = express();
const port = process.env.PORT || 3000;  // Usa el puerto de Render si está disponible, si no, el puerto 3000

app.use(cors());

db.sequelize.sync({ force: true }).then(() => {
  console.log('Base de datos sincronizada');
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});

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
app.use('/api/mostSoldProducts/', cartRoutes);
app.use('/api/factura/', facturaRoutes);
app.use('/api/', authRoutes); // inicio de sesion

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
