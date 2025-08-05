module.exports = (sequelize, Sequelize) => {
  const Orders = sequelize.define("Orders", {
    id_order: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  Orders.associate = (models) => {
    Orders.belongsTo(models.Users, {
      foreignKey: "id_user",
      as: "user",
    });
  };

  return Orders;
};
