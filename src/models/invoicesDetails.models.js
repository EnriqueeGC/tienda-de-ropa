module.exports = (sequelize, Sequelize) => {
  const InvoicesDetails = sequelize.define("InvoicesDetails", {
    invoiceDetailId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productVariantId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    pricePerUnit: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  InvoicesDetails.associate = (models) => {
    InvoicesDetails.belongsTo(models.Invoices, {
      foreignKey: "invoiceId",
      as: "invoice",
    });
  };

  return InvoicesDetails;
};
