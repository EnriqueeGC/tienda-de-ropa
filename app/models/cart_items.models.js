module.exports = (sequelize, Sequelize) => {
  const CartItems = sequelize.define("CartItems", {
    cartItemId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ShoppingCarts", // Assuming the table name is 'ShoppingCarts'
        key: "cartId",
      },
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Assuming the table name is 'Products'
        key: "productId",
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  CartItems.associate = (models) => {
    CartItems.belongsTo(models.ShoppingCarts, {
      foreignKey: "cartId",
      as: "cart",
    });
    CartItems.belongsTo(models.Products, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return CartItems;
};
