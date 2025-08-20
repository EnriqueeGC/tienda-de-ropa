module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    idUser: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    secondName: {
      type: Sequelize.STRING,
      allowNull: true // Second name is optional
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    secondLastName: {
      type: Sequelize.STRING,
      allowNull: true // Second last name is optional
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true, // Address is optional
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true, // Phone number is optional
      validate: {
        is: /^[0-9]+$/i // Validate that phone number contains only digits
      }
    },
    email: {
      type: Sequelize.STRING, 
      allowNull: false, 
      unique: true
    }, 
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }, 
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    }, 
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user' // Role can be 'user', 'admin', 'employee'.
    }
  });

  return User;
};
