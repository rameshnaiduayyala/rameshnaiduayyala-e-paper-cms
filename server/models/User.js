const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
    role: {
    type: DataTypes.ENUM("user", "admin", "editor", "author", "contributor", "subscriber", "maintainer", "manager"),
    defaultValue: "user"
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;
