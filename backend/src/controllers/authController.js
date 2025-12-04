const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '2h' } // Aumentado de 15m para 2h
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Remove password from response
    const userResponse = { ...user._doc };
    delete userResponse.password;
    
    res.status(201).json({
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated.' });
    }
    
    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Remove password from response
    const userResponse = { ...user._doc };
    delete userResponse.password;
    
    res.json({
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required.' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }
    
    const { accessToken } = generateTokens(user._id);
    
    res.json({
      accessToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getProfile
};