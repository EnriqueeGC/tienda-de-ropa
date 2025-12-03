module.exports = (sequelize, Sequelize) => {
  const ShoppingCart = sequelize.define("ShoppingCartDetails", {
    carteDetailsId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ShoppingCarts",
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
    variantId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Variants", // Assuming the table name is 'Variants'
        key: "variantId",
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  ShoppingCart.associate = (models) => {
    ShoppingCart.belongsTo(models.ShoppingCarts, {
      foreignKey: "cartId",
      as: "cart",
    });
    ShoppingCart.belongsTo(models.Products, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return ShoppingCart;
};
