module.exports = (sequelize, Sequelize) => {
  const CartItems = sequelize.define("CartItems", {
    id_cart_item: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cart: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ShoppingCarts", // Assuming the table name is 'ShoppingCarts'
        key: "id_cart",
      },
    },
    id_product: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Assuming the table name is 'Products'
        key: "id_product",
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
      foreignKey: "id_cart",
      as: "cart",
    });
    CartItems.belongsTo(models.Products, {
      foreignKey: "id_product",
      as: "product",
    });
  };

  return CartItems;
};
