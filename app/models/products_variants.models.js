const { size } = require("pdfkit/js/page");

module.exports = (sequelize, Sequelize) => {
  const ProductsVariants = sequelize.define("ProductsVariants", {
    productVariantId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Assuming the table name is 'Products'
        key: "productId",
      },
    },
    sizeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Sizes", // Assuming the table name is 'Sizes'
        key: "sizeId",
      },
    },
    colorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Colors", // Assuming the table name is 'Colors'
        key: "colorId",
      },
    },
    genderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Genders",
        key: "id_gender",
      },
    },
    sku: {
      // Stock Keeping Unit
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    stockQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    urlImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    indexes: [
      {
        unique: true,
        fields: ["productId", "sizeId", "colorId"],
      },
    ],
  });

  ProductsVariants.associate = (models) => {
    ProductsVariants.belongsTo(models.Products, {
      foreignKey: "productId",
      as: "product",
    });
    ProductsVariants.belongsTo(models.Sizes, {
      foreignKey: "sizeId",
      as: "size",
    });
    ProductsVariants.belongsTo(models.Colors, {
      foreignKey: "colorId",
      as: "color",
    });
  };

  return ProductsVariants;
};
