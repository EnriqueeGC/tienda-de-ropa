module.exports = (sequelize, Sequelize) => {
  const Orders = sequelize.define("Orders", {
    orderId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

  Orders.associate = (models) => {
    Orders.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Orders;
};
