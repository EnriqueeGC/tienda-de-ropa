module.exports = (sequelize, Sequelize) => { 
  const ShoppingCarts = sequelize.define ('ShoppingCarts', {
    id_cart: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming the table name is 'Users'
        key: 'id_user'
      }
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active', 
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

  ShoppingCarts.associate = (models) => {
    ShoppingCarts.belongsTo(models.Users, {
      foreignKey: 'id_user',
      as: 'user',
    });
  };

  return ShoppingCarts;
}
