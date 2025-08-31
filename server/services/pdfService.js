const path = require('path');
const fs = require('fs');
const pdf = require('pdf-poppler');

async function pdfToImages(pdfPath, outputDir, baseName) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const opts = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: baseName, // Use same base name for all images
    page: null,
  };

  await pdf.convert(pdfPath, opts);

  return fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) // Ensure correct order
    .map((f, i) => ({
      pageNumber: i + 1,
      imagePath: `/uploads/pages/${path.basename(outputDir)}/${f}`,
    }));
}

module.exports = { pdfToImages };
