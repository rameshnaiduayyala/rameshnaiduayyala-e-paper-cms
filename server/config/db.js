const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('enewspaper', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
