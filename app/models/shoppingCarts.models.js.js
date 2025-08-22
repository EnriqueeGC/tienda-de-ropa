module.exports = (sequelize, Sequelize) => { 
  const ShoppingCarts = sequelize.define ('ShoppingCarts', {
    cartId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming the table name is 'Users'
        key: 'userId'
      }
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active', 
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

  ShoppingCarts.associate = (models) => {
    ShoppingCarts.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return ShoppingCarts;
}
