const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendNewMembershipEmail } = require('../services/emailService');
require('dotenv').config();

// Rate limiter middleware for login
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Register route
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const formData = req.body;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ ...formData, ...{password: hashedPassword} });

    await newUser.save();

    sendNewMembershipEmail(formData)
    res.status(201).json({ message: 'User registered successfully', data:newUser});
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login route with rate limiting
const login = [loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log(user);
    

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { 
      httpOnly: true, 
      // secure: process.env.NODE_ENV === 'production', 
      // sameSite: 'Strict',
      maxAge: 3600000 // 1 hour
    });
    res.status(200).json({ user, token:token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}];

// Token validation middleware
const validateToken = async(req, res, next) => {
  console.log(req);
  
  const data = await User.findById(req.user.id)
  res.status(200).json({
      message:'success',
      data:data
  })
};

module.exports = { register, login, validateToken };
