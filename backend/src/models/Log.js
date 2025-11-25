const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['view', 'access_denied', 'purchase', 'login', 'register', 'admin_action']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: false
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  details: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Log', logSchema);