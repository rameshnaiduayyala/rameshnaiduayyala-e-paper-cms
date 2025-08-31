const { Article } = require('../models');

// Create an article (bounding box + content)
exports.createArticle = async (req, res) => {
  try {
    const { pageId, title, content, x, y, width, height } = req.body;

    if (!pageId || x === undefined || y === undefined || width === undefined || height === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const article = await Article.create({
      pageId, title, content, x, y, width, height,
    });

    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// Get all articles for a page
exports.getArticlesByPage = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { pageId: req.params.pageId },
      order: [['id', 'ASC']],
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get a single article
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    await article.update(req.body);
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    await article.destroy();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};
