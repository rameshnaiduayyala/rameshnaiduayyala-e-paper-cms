const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Paper = sequelize.define("Paper", {
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  published: { type: DataTypes.BOOLEAN, defaultValue: false },
  pdfPath: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Paper;
