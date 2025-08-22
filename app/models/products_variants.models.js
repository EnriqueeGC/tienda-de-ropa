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
        model: "Products",
        key: "productId",
      },
    },
    sizeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Sizes",
        key: "sizeId",
      },
    },
    colorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Colors",
        key: "colorId",
      },
    },
    genderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Genders",
        key: "genderId",
      },
    },
    sku: {
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
  }, {
    timestamps: true, // 👈 crea createdAt y updatedAt
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
