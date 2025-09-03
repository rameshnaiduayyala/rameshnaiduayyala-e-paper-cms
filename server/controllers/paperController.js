const path = require("path");
const fs = require("fs");
const { Paper, Page } = require("../models");
const { splitPdfPages, pdfToImages } = require("../services/pdfService");

const uploadDir = path.join("uploads", "papers");
const pageDir = path.join("uploads", "pages");

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

    // Move uploaded file from temp to uploads/papers
    fs.renameSync(req.file.path, absPdfPath);

    // Create output folder for pages
    const absPageDir = path.join(pageDir, baseName);
    fs.mkdirSync(absPageDir, { recursive: true });

    // 🔥 Generate images for PDF pages
    const images = await pdfToImages(absPdfPath, absPageDir, baseName);

    // Pick first image as thumbnail
    const thumbnailPath = images.length > 0 ? images[0].imagePath : null;

    // Save Paper with thumbnail path
    const paper = await Paper.create({
      title,
      date,
      published: false,
      pdfPath: fixPath(path.join("papers", pdfFilename)),
      thumbnail: thumbnailPath, // 🔥 Save thumbnail path
    });

    // Split PDF into single-page PDFs
    const pages = await splitPdfPages(absPdfPath, absPageDir, baseName);

    // Save Pages with RELATIVE paths
    for (let i = 0; i < pages.length; i++) {
      await Page.create({
        paperId: paper.id,
        pageNumber: pages[i].pageNumber,
        pdfPagePath: fixPath(pages[i].pdfPagePath),
        imagePath: fixPath(images[i]?.imagePath || ""), // 🔥 Save page image
      });
    }

    res.json({ message: "Paper uploaded successfully", paperId: paper.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload paper" });
  }
};

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
      thumbnail: paper.thumbnail || (paper.pages[0]?.imagePath || null),
      firstPage: paper.pages.length > 0 ? paper.pages[0].pdfPagePath : null,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch papers" });
  }
};

exports.getPaperById = async (req, res) => {
  try {
    const { id } = req.params;

    const papers = await Paper.findAll({
      where: { id },
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
      thumbnail: paper.thumbnail || (paper.pages[0]?.imagePath || null),
      firstPage: paper.pages.length > 0 ? paper.pages[0].pdfPagePath : null,
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
      published: paper.published,
      thumbnail: paper.thumbnail || (paper.pages[0]?.imagePath || null),
      firstPage: paper.pages.length > 0 ? paper.pages[0].pdfPagePath : null,
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

    const result = pages.map((p) => ({
      id: p.id,
      paperId: p.paperId,
      pageNumber: p.pageNumber,
      pdfPagePath: p.pdfPagePath,
      imagePath: p.imagePath, // 🔥 Add image path for frontend
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    res.json(result);
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

    res.json({
      message: "Publication status updated",
      id: paper.id,
      published: paper.published,
      thumbnail: paper.thumbnail,
      pdfPath: paper.pdfPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update publication status" });
  }
};
