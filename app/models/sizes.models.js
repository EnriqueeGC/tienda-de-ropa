module.exports = (sequelize, Sequelize) => {
  const Sizes = sequelize.define("Sizes", {
    id_size: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    kind_of_size: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return Sizes;
};
