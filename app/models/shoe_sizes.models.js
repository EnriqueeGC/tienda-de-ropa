module.exports = (sequelize, Sequelize) => {
  const ShoeSizes = sequelize.define("shoe_sizes", {
    id_shoe_size: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    size: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true, // Asegura que el tamaño sea numérico
      },
    },
  });

  return ShoeSizes;
};
