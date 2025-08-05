module.exports = (sequelize, sequelize) => {
  const Subcategory = sequelize.define('Subcategory', {
    id_subcategory: {
      type: sequelize.INTEGER, 
      primarykey: true,
      autoIncrement: true
    },
    name: {
      type: sequelize.STRING,
      allowNull: false, 
      unique: true
    },
    description: {
      type: sequelize.TEXT,
      allowNull: true,
    },
    id_category: {
      type: sequelize.INTEGER,
      allowNull: false, 
      references: {
        model: 'Categories', // Assuming the table name is 'Categories'
        key: 'id_category'
      }
    }
  });

  Subcategory.associate = (models) => {
    Subcategory.belongsTo(models.Category, {
      foreignKey: 'id_category',
      as: 'category'
    });
  };

  return Subcategory;
};
