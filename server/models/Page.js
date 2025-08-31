const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Page = sequelize.define('Page', {
  pageNumber: { type: DataTypes.INTEGER, allowNull: false },
  imagePath: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Page;
