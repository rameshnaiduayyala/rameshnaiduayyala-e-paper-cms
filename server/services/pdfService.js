const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

// Convert PDF to images
const { exec } = require("child_process");

function pdfToImages(pdfPath, outputDir, baseName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "convert_pdf.py");

    const command = `python "${scriptPath}" "${pdfPath}" "${outputDir}" "${baseName}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) console.error(stderr);

      console.log(stdout);

      resolve(
        fs.readdirSync(outputDir)
          .filter((f) => f.endsWith(".jpg"))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((f, i) => ({
            pageNumber: i + 1,
            imagePath: `/uploads/pages/${path.basename(outputDir)}/${f}`,
          }))
      );
    });
  });
}



// Split PDF into single-page PDFs
async function splitPdfPages(pdfPath, outputDir, baseName) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytesPage = await newPdf.save();

    const filename = `${baseName}_page_${i + 1}.pdf`;
    const pagePath = path.join(outputDir, filename);
    fs.writeFileSync(pagePath, pdfBytesPage);

    pages.push({
      pageNumber: i + 1,
      pdfPagePath: path.join("pages", baseName, filename),
    });
  }

  return pages;
}

module.exports = { pdfToImages, splitPdfPages };
