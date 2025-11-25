const Log = require('../models/Log');

const logAction = (action, details = null) => {
  return async (req, res, next) => {
    try {
      // Create log entry
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
    
    next();
  };
};

module.exports = { logAction };