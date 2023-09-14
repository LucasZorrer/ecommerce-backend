const { Sequelize, DataTypes } = require('sequelize');

// Replace these with your actual database configuration
const sequelize = new Sequelize('database_development', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql', // Change this to match your database dialect (e.g., 'mysql', 'postgres', etc.)
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
