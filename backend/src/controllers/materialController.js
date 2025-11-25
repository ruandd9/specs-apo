const Material = require('../models/Material');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');
const { convertPdfToImages } = require('../services/pdfConverter');

const getAllMaterials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // For regular users, only show active materials
    // For admins, show all materials
    const filter = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    
    const materials = await Material.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
      
    const total = await Material.countDocuments(filter);
    
    res.json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if material is active (unless user is admin)
    if (!material.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }
    
    // Create material
    const material = new Material({
      title,
      description,
      price: parseFloat(price),
      pdfPath: req.file.path,
      imagePath: '', // Will be set after conversion
      imageCount: 0, // Will be set after conversion
      createdBy: req.user._id
    });
    
    await material.save();
    
    // Convert PDF to images
    try {
      const { imagePath, imageCount } = await convertPdfToImages(req.file.path, material._id);
      material.imagePath = imagePath;
      material.imageCount = imageCount;
      await material.save();
    } catch (conversionError) {
      console.error('Error converting PDF to images:', conversionError);
      // Don't fail the request if conversion fails, but log the error
    }
    
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { title, description, price, isActive } = req.body;
    
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Update fields if provided
    if (title) material.title = title;
    if (description) material.description = description;
    if (price) material.price = parseFloat(price);
    if (typeof isActive !== 'undefined') material.isActive = isActive;
    
    await material.save();
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Delete associated files if they exist
    try {
      if (material.pdfPath) {
        await fs.unlink(material.pdfPath);
      }
      if (material.imagePath) {
        const imagePathDir = path.dirname(material.imagePath);
        await fs.rm(imagePathDir, { recursive: true, force: true });
      }
    } catch (fileError) {
      console.warn('Error deleting associated files:', fileError.message);
    }
    
    await material.remove();
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};