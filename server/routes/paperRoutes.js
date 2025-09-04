const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadPaper, getPapers, getPages, getAllPapers,publishChenge,getPaperById } = require('../controllers/paperController');

const upload = multer({
  dest: path.join(__dirname, "..", "temp")
});

const router = express.Router();

// Upload paper
router.post('/', upload.single('pdf'), uploadPaper);

// Get all papers
router.get('/', getPapers);

router.get('/admin', getAllPapers);
router.post('/admin/publish/:id', publishChenge);

// Get pages for a paper
router.get('/:id/pages', getPages);

router.get('/one/:id', getPaperById);

module.exports = router;
