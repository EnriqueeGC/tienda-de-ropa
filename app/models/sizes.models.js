module.exports = (sequelize, Sequelize) => {
  const Sizes = sequelize.define("Sizes", {
    sizeId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    kindOfSize: {
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
