module.exports = (sequelize, Sequelize) => {
  const Colors = sequelize.define("Colors", {
    colorId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    hex_value: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Colors;
};
