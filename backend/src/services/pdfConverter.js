const pdf = require('pdf-poppler');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const convertPdfToImages = async (pdfPath, materialId) => {
  try {
    // Create directory for images
    const imageDir = path.join(__dirname, '../../uploads/images', materialId.toString());
    await fs.mkdir(imageDir, { recursive: true });
    
    // Convert PDF to images
    const opts = {
      format: 'png',
      out_dir: imageDir,
      out_prefix: 'page',
      page: null
    };
    
    await pdf.convert(pdfPath, opts);
    
    // Get all image files
    const files = await fs.readdir(imageDir);
    const imageFiles = files.filter(file => file.endsWith('.png')).sort();
    
    // Optimize images
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = path.join(imageDir, imageFiles[i]);
      const optimizedPath = path.join(imageDir, `optimized-${imageFiles[i]}`);
      
      await sharp(imagePath)
        .resize(1200, null, { withoutEnlargement: true })
        .png({ quality: 80 })
        .toFile(optimizedPath);
      
      // Remove original file
      await fs.unlink(imagePath);
    }
    
    return {
      imagePath: imageDir,
      imageCount: imageFiles.length
    };
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw error;
  }
};

const addWatermark = async (imagePath, watermarkText) => {
  try {
    const watermarkedPath = imagePath.replace('.png', '-watermarked.png');
    
    // Create watermark text as image
    const watermark = await sharp({
      text: {
        text: watermarkText,
        font: 'Arial',
        fontfile: null,
        rgba: true,
        dpi: 300
      }
    })
    .resize(200, 50)
    .png()
    .toBuffer();
    
    // Composite watermark onto image
    await sharp(imagePath)
      .composite([{
        input: watermark,
        gravity: 'southeast'
      }])
      .toFile(watermarkedPath);
    
    return watermarkedPath;
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
};

module.exports = {
  convertPdfToImages,
  addWatermark
};