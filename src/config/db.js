const dbConfig = require("./db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/users.models.js")(sequelize, Sequelize);

db.Category = require("../models/categories.models.js")(sequelize, Sequelize);
db.SubCategories = require("../models/subcategories.models.js")(sequelize, Sequelize);
db.Product = require("../models/products.model.js")(sequelize, Sequelize);
db.Colors = require("../models/colors.models.js")(sequelize, Sequelize);
db.Genders = require("../models/genders.models.js")(sequelize, Sequelize);
db.ProductsVariants = require("../models/productsVariants.models.js")(sequelize, Sequelize);
db.Sizes = require("../models/sizes.models.js")(sequelize, Sequelize);
db.ShoesSizes = require("../models/shoesSizes.models.js")(sequelize, Sequelize);

db.Invoices = require("../models/invoices.models.js")(sequelize, Sequelize);
db.InvoicesDetails = require("../models/invoicesDetails.models.js")(sequelize, Sequelize);

db.Orders = require("../models/orders.models.js")(sequelize, Sequelize);
db.OrderDetails = require("../models/orderDetails.models.js")(sequelize, Sequelize);

db.Payments = require("../models/payments.models.js")(sequelize, Sequelize);

db.ShoppingCart = require("../models/shoppingCarts.models.js")(sequelize, Sequelize);
db.CartItems = require("../models/cartItems.models.js")(sequelize, Sequelize);

db.Discounts = require("../models/discounts.models.js")(sequelize, Sequelize);

module.exports = db;
