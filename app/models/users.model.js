module.exports = (sequelize, sequelize) => {
  const User = sequelize.define('User', {
    id_user: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: sequelize.STRING,
      allowNull: false
    },
    second_name: {
      type: sequelize.STRING,
      allowNull: true // Second name is optional
    },
    last_name: {
      type: sequelize.STRING,
      allowNull: false
    },
    second_last_name: {
      type: sequelize.STRING,
      allowNull: true // Second last name is optional
    },
    address: {
      type: sequelize.STRING,
      allowNull: true, // Address is optional
    },
    phone: {
      type: sequelize.STRING,
      allowNull: true, // Phone number is optional
      validate: {
        is: /^[0-9]+$/i // Validate that phone number contains only digits
      }
    },
    email: {
      type: sequelize.STRING, 
      allowNull: false, 
      unique: true
    }, 
    username: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true
    }, 
    password: {
      type: sequelize.STRING,
      allowNull: false,
    }, 
    role: {
      type: sequelize.STRING,
      allowNull: false,
      defaultValue: 'user' // Role can be 'user', 'admin', 'employee'.
    }
  })
  return User;
} 
