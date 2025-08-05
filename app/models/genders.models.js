module.exports = (sequelize, Sequelize) => {
  const Genders = sequelize.define("Genders", {
    id_gender: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Genders;
};
