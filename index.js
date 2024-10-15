const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes.js');
const categoryRoutes = require('./routes/category.routes.js')
const productRoutes = require('./routes/product.routes.js');
const discountRoutes = require('./routes/discount.routes.js');
const authRoutes = require('./routes/auth.routes.js')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users/', userRoutes);
app.use('/api/categories/', categoryRoutes);
app.use('/api/products/', productRoutes);
app.use('/api/discounts/', discountRoutes);
app.use('/api/', authRoutes); // inicio de sesion

app.listen(port, () => {
    console.log(`Servidor corriendo en en http://localhost:${port}`);
})