const express = require('express');
const { register, login, validateToken } = require('../controllers/auth');
const {authenticateToken}  = require('../middlewares/authMiddleware');
const User = require('../models/user');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/members/list', async (req, res) => {
  try {
    // Get user ID from the request parameters

    // Find user by ID
    const users = await User.find();

   

    // Return the user data as a response
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:id', async (req, res) => {
    try {
      // Get user ID from the request parameters
      const userId = req.params.id;
  
      // Find user by ID
      const user = await User.findById(userId);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user data as a response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.put('/user/:id', async (req, res) => {
    try {
      // Get user ID from the request parameters
      const userId = req.params.id;
  
      // Data to update (from the request body)
      const updates = req.body;
  
      // Find the user by ID and update the document
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true, // Return the updated document
        runValidators: true, // Ensure the updates follow schema validation
      });
  
      // Check if user exists
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the updated user data
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/validate', authenticateToken, validateToken)


module.exports = router;
