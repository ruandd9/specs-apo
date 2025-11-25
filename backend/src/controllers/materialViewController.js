const Material = require('../models/Material');
const User = require('../models/User');
const path = require('path');

const viewMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    // Find the material
    const material = await Material.findById(id);
    
    if (!material || !material.isActive) {
      // Log access denied
      try {
        const Log = require('../models/Log');
        await Log.create({
          action: 'access_denied',
          user: user ? user._id : null,
          material: id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          details: `User tried to access inactive material ${id}`
        });
      } catch (logError) {
        console.error('Error logging:', logError);
      }
      return res.status(404).json({ message: 'Material not found or inactive' });
    }
    
    // Check if user owns this material
    if (!user.ownedMaterials.includes(id)) {
      // Log access denied
      try {
        const Log = require('../models/Log');
        await Log.create({
          action: 'access_denied',
          user: user._id,
          material: id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          details: `User ${user._id} tried to access material ${id} without permission`
        });
      } catch (logError) {
        console.error('Error logging:', logError);
      }
      return res.status(403).json({ message: 'You do not have access to this material' });
    }
    
    // Log successful view
    try {
      const Log = require('../models/Log');
      await Log.create({
        action: 'view',
        user: user._id,
        material: id,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        details: `User ${user._id} viewed material ${id}`
      });
    } catch (logError) {
      console.error('Error logging:', logError);
    }
    
    // Return material info with PDF path
    res.json({
      material: {
        id: material._id,
        title: material.title,
        description: material.description,
        pdfUrl: `/api/materials/${id}/pdf`,
        watermark: `${user.name} - ${user.email}`
      }
    });
  } catch (error) {
    console.error('Error viewing material:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPdf = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📄 Requisição de PDF recebida:', { id, token: req.query.token ? 'presente' : 'ausente' });
    
    // Permitir token via query string para PDF.js
    let user = req.user;
    if (!user && req.query.token) {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      try {
        const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
        user = await User.findById(decoded.userId).select('-password');
        console.log('✅ Usuário autenticado via token:', user.email);
      } catch (err) {
        console.error('❌ Erro ao verificar token:', err.message);
        return res.status(401).json({ message: 'Token inválido' });
      }
    }
    
    if (!user) {
      console.error('❌ Usuário não autenticado');
      return res.status(401).json({ message: 'Não autorizado' });
    }
    
    // Find the material
    const material = await Material.findById(id);
    console.log('📚 Material encontrado:', material ? material.title : 'não encontrado');
    
    if (!material || !material.isActive) {
      console.error('❌ Material não encontrado ou inativo');
      try {
        const Log = require('../models/Log');
        await Log.create({
          action: 'access_denied',
          user: user ? user._id : null,
          material: id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          details: `User tried to access PDF of inactive material ${id}`
        });
      } catch (logError) {
        console.error('Error logging:', logError);
      }
      return res.status(404).json({ message: 'Material not found or inactive' });
    }
    
    // Check if user owns this material
    const hasAccess = user.ownedMaterials.some(m => m.toString() === id.toString());
    console.log('🔑 Verificando acesso:', { 
      userId: user._id, 
      materialId: id,
      ownedMaterials: user.ownedMaterials.map(m => m.toString()),
      hasAccess 
    });
    
    if (!hasAccess) {
      console.error('❌ Usuário não tem acesso ao material');
      try {
        const Log = require('../models/Log');
        await Log.create({
          action: 'access_denied',
          user: user._id,
          material: id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          details: `User ${user._id} tried to access PDF of material ${id} without permission`
        });
      } catch (logError) {
        console.error('Error logging:', logError);
      }
      return res.status(403).json({ message: 'You do not have access to this material' });
    }
    
    // Check if PDF exists
    const pdfPath = path.join(__dirname, '../../', material.pdfPath);
    console.log('📁 Caminho do PDF:', pdfPath);
    
    if (!require('fs').existsSync(pdfPath)) {
      console.error('❌ Arquivo PDF não encontrado no caminho:', pdfPath);
      return res.status(404).json({ message: 'PDF file not found' });
    }
    
    console.log('✅ Servindo PDF...');
    
    // Set headers to prevent download and enable inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Stream the PDF file
    const fileStream = require('fs').createReadStream(pdfPath);
    fileStream.on('error', (err) => {
      console.error('❌ Erro ao ler arquivo:', err);
      res.status(500).json({ message: 'Error reading PDF file' });
    });
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMaterialImage = async (req, res) => {
  try {
    const { id, imagePath } = req.params;
    const user = req.user;
    
    // Find the material
    const material = await Material.findById(id);
    
    if (!material || !material.isActive) {
      // Log access denied
      await logAction('access_denied')({}, req, `User tried to access image of inactive material ${id}`);
      return res.status(404).json({ message: 'Material not found or inactive' });
    }
    
    // Check if user owns this material
    if (!user.ownedMaterials.includes(id)) {
      // Log access denied
      await logAction('access_denied')({}, req, `User ${user._id} tried to access image of material ${id} without permission`);
      return res.status(403).json({ message: 'You do not have access to this material' });
    }
    
    // Construct the full image path
    const fullPath = path.join(__dirname, '../../', imagePath);
    
    // Check if the image belongs to this material
    if (!fullPath.startsWith(material.imagePath)) {
      // Log access denied
      await logAction('access_denied')({}, req, `User ${user._id} tried to access unauthorized image path`);
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Serve the image
    res.sendFile(fullPath);
  } catch (error) {
    console.error('Error serving material image:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewMaterial,
  getMaterialImage,
  getPdf
};