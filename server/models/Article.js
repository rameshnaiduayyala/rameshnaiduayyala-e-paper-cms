const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Article = sequelize.define('Article', {
  title: { type: DataTypes.STRING },
  x: { type: DataTypes.FLOAT },
  y: { type: DataTypes.FLOAT },
  width: { type: DataTypes.FLOAT },
  height: { type: DataTypes.FLOAT },
  imagePath: DataTypes.STRING,
});

module.exports = Article;
