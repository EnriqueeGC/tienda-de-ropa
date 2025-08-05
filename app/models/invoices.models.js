const { or } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Invoices = sequelize.define("Invoices", {
    id_invoice: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    id_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_payment: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    invoice_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  Invoices.associate = (models) => {
    Invoices.belongsTo(models.Orders, {
      foreignKey: "id_order",
      as: "order",
    });
  };

  return Invoices;
};
