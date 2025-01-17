const router = require('express').Router();
const UserModel = require('../Models/User');
const ensureAuthenticated = require('./Middlewares/auth'); // Assuming auth middleware is set up

// Middleware to check if the user is an admin
const ensureAdmin = (req, res, next) => {
  if (!req.user.roles || !req.user.roles.includes('admin')) {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  next();
};

// Route to fetch user data (Authenticated user can fetch their own data)
router.get('/user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id); // or use findByEmail if necessary
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Respond with user data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Route to fetch all users (Admin only)
router.get('/users', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const users = await UserModel.find(); // Fetch all users
    res.json(users); // Return the users as a JSON array
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users data' });
  }
});

// Route to delete a user by ID (Admin only)
router.delete('/users/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findByIdAndDelete(userId); // Find the user by ID and delete them
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
