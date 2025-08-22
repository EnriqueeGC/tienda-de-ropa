module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define("Products", {
    productId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    subcategoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Subcategories",
        key: "subcategoryId",
      },
    },
  });

  Products.associate = (models) => {
    Products.hasMany(models.ProductsVariants, {
      foreignKey: "productId",
      as: "variants",
    });
  };

  return Products;
};
