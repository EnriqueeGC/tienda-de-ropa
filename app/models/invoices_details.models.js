module.exports = (sequelize, Sequelize) => {
  const InvoicesDetails = sequelize.define("InvoicesDetails", {
    id_invoice_detail: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_invoice: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_product_variant: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price_per_unit: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  InvoicesDetails.associate = (models) => {
    InvoicesDetails.belongsTo(models.Invoices, {
      foreignKey: "id_invoice",
      as: "invoice",
    });
  };

  return InvoicesDetails;
};
