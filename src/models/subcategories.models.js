module.exports = (sequelize, Sequelize) => {
  const Subcategory = sequelize.define('Subcategory', {
    subcategoryId: {
      type: Sequelize.INTEGER, 
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false, 
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories', // Assuming the table name is 'Categories'
        key: 'categoryId'
      }
    }
  });

  Subcategory.associate = (models) => {
    Subcategory.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Subcategory;
};
