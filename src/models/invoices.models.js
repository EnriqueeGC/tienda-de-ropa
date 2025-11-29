const { or } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Invoices = sequelize.define("Invoices", {
    invoiceId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    paymentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    invoiceDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  Invoices.associate = (models) => {
    Invoices.belongsTo(models.Orders, {
      foreignKey: "orderId",
      as: "order",
    });
  };

  return Invoices;
};
