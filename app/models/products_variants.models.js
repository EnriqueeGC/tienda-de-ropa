const { size } = require("pdfkit/js/page");

module.exports = (sequelize, Sequelize) => {
  const ProductsVariants = sequelize.define("ProductsVariants", {
    id_product_variant: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_product: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Assuming the table name is 'Products'
        key: "id_product",
      },
    },
    id_size: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Sizes", // Assuming the table name is 'Sizes'
        key: "id_size",
      },
    },
    id_color: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Colors", // Assuming the table name is 'Colors'
        key: "id_color",
      },
    },
    id_gender: {
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
    stock_quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    url_image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    indexes: [
      {
        unique: true,
        fields: ["id_product", "id_size", "id_color"],
      },
    ],
  });

  ProductsVariants.associate = (models) => {
    ProductsVariants.belongsTo(models.Products, {
      foreignKey: "id_product",
      as: "product",
    });
    ProductsVariants.belongsTo(models.Sizes, {
      foreignKey: "id_size",
      as: "size",
    });
    ProductsVariants.belongsTo(models.Colors, {
      foreignKey: "id_color",
      as: "color",
    });
  };

  return ProductsVariants;
};
