const express = require('express');
const {
  createArticle,
  getArticlesByPage,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

const router = express.Router();

router.post('/', createArticle);                  // Create a new article
router.get('/page/:pageId', getArticlesByPage);   // Get all articles for a page
router.get('/:id', getArticle);                   // Get single article
router.put('/:id', updateArticle);                // Update article
router.delete('/:id', deleteArticle);             // Delete article

module.exports = router;
