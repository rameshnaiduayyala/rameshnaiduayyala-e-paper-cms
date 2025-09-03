const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Page = sequelize.define('Page', {
  pageNumber: { type: DataTypes.INTEGER, allowNull: false },
  pdfPagePath: { type: DataTypes.STRING, allowNull: false },
  imagePath: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Page;
