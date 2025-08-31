const sequelize = require('../config/db');
const Paper = require('./Paper');
const Page = require('./Page');
const Article = require('./Article');

// Paper → Page
Paper.hasMany(Page, { foreignKey: 'paperId', as: 'pages', onDelete: 'CASCADE' });
Page.belongsTo(Paper, { foreignKey: 'paperId', as: 'paper' });

// Page → Article
Page.hasMany(Article, { foreignKey: 'pageId', as: 'articles', onDelete: 'CASCADE' });
Article.belongsTo(Page, { foreignKey: 'pageId', as: 'page' });

module.exports = { sequelize, Paper, Page, Article };
