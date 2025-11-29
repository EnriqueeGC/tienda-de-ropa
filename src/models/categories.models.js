module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define('Categories', {
    categoryId: {
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
      allowNull: true
    }
  });

  Categories.associate = (models) => {
    Categories.hasMany(models.Subcategory, {
      foreignKey: 'categoryId',
      as: 'subcategories'
    });
  };

  return Categories;
}
