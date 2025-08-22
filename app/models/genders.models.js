module.exports = (sequelize, Sequelize) => {
  const Genders = sequelize.define("Genders", {
    genderId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Genders;
};
