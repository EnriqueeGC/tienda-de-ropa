module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define('Categories', {
    id_category: {
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
      foreignKey: 'id_category',
      as: 'subcategories'
    });
  };

  return Categories;
}
