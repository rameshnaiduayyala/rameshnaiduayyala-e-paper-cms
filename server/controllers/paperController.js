const path = require("path");
const fs = require("fs");
const { Paper, Page } = require("../models");
const { pdfToImages } = require("../services/pdfService");

const uploadDir = path.join("uploads", "pdfs"); // Relative path
const pageDir = path.join("uploads", "pages"); // Relative path

// Helper to normalize paths
const fixPath = (p) => p.replace(/\\/g, "/");

exports.uploadPaper = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { title, date } = req.body;

    // Ensure upload directories exist
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.mkdirSync(pageDir, { recursive: true });

    // Generate date-based filename: YYYYMMDD_<unique>
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const uniqueNum = Math.floor(Math.random() * 10000);
    const baseName = `${today}_${uniqueNum}`;

    // Build PDF filename and save path
    const pdfFilename = `${baseName}.pdf`;
    const absPdfPath = path.join(uploadDir, pdfFilename);

    // Move uploaded file from temp to uploads/pdfs
    fs.renameSync(req.file.path, absPdfPath);

    // Save Paper with RELATIVE path
    const paper = await Paper.create({
      title,
      date,
      published: false,
      pdfPath: fixPath(path.join("pdfs", pdfFilename)),
    });

    // Create output folder for pages with SAME NAME
    const absPageDir = path.join(pageDir, baseName);
    fs.mkdirSync(absPageDir, { recursive: true });

    // Convert PDF to images
    const pages = await pdfToImages(absPdfPath, absPageDir, baseName);

    // Save Pages with RELATIVE paths
    for (const p of pages) {
      await Page.create({
        paperId: paper.id,
        pageNumber: p.pageNumber,
        imagePath: fixPath(path.join(p.imagePath)),
      });
    }

    res.json({ message: "Paper uploaded successfully", paperId: paper.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload paper" });
  }
};

// GET /api/papers?date=2025-08-31
exports.getPapers = async (req, res) => {
  try {
    const { date } = req.query;

     const whereClause = { published: true };
    if (date) whereClause.date = date;

    const papers = await Paper.findAll({
      where: whereClause,
      order: [["date", "DESC"]],
      include: [
        {
          model: Page,
          as: "pages",
          where: { pageNumber: 1 },
          required: false,
        },
      ],
    });

    const result = papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      date: paper.date,
      pdfPath: paper.pdfPath,
      thumbnail: paper.pages.length > 0 ? paper.pages[0].imagePath : null,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch papers" });
  }
};

exports.getAllPapers = async (req, res) => {
  try {
    const { date } = req.query;

    const whereClause = {};
    if (date) whereClause.date = date;

    const papers = await Paper.findAll({
      where: whereClause,
      order: [["date", "DESC"]],
      include: [
        {
          model: Page,
          as: "pages",
          where: { pageNumber: 1 }, // first page thumbnail
          required: false,
        },
      ],
    });

    const result = papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      date: paper.date,
      pdfPath: paper.pdfPath,
      published: paper.published,
      thumbnail: paper.pages.length > 0 ? paper.pages[0].imagePath : null,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch papers" });
  }
};

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      where: { paperId: req.params.id },
      order: [["pageNumber", "ASC"]],
    });
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
};

exports.publishChenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { published } = req.body;
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    paper.published = published;
    await paper.save();
    res.json({ message: "Publication status updated", published: paper.published });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update publication status" });
  }
};
