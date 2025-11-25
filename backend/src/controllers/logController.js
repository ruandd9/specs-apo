const Log = require('../models/Log');

const createLog = async (action, req, details = null) => {
  try {
    const log = new Log({
      action,
      user: req.user ? req.user._id : null,
      material: req.params.id || null,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details
    });
    
    await log.save();
  } catch (error) {
    console.error('Error creating log:', error);
  }
};

const getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const logs = await Log.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('material', 'title');
      
    const total = await Log.countDocuments();
    
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id)
      .populate('user', 'name email')
      .populate('material', 'title');
    
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const logs = await Log.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('material', 'title');
      
    const total = await Log.countDocuments({ user: userId });
    
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const logs = await Log.find({ action })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('material', 'title');
      
    const total = await Log.countDocuments({ action });
    
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLog,
  getAllLogs,
  getLogById,
  getLogsByUser,
  getLogsByAction
};