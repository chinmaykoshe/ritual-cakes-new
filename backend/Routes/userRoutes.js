const router = require('express').Router();
const UserModel = require('../Models/User');
const ensureAuthenticated = require('./Middlewares/auth'); // Assuming auth middleware is set up


// Route to fetch user data (Authenticated user can fetch their own data)
router.get('/user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id); // or use findByEmail if necessary
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    res.json({
      success: true,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        address: user.address,
      },
    }); // Respond with user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', success: false });
  }
});

// Route to update user data (Authenticated user can update their own data)
router.put('/user', ensureAuthenticated, async (req, res) => {
  try {
    const { name, surname, email, password, address, mobile, dob } = req.body;
    const user = await UserModel.findById(req.user._id); // or use findByEmail if necessary

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Update user details
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (address) user.address = address;
    if (mobile) user.mobile = mobile;
    if (dob) user.dob = dob;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({
      message: `User details updated successfully at ${new Date().toLocaleString()}`,
      success: true,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Error updating user data', success: false });
  }
});



// Route to fetch all users (Admin only)
router.get('/users', ensureAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find(); // Fetch all users
    res.json(users); // Return the users as a JSON array
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users data' });
  }
});

// Route to delete a user by ID (Admin only)
router.delete('/users/:id', ensureAuthenticated, async (req, res) => {
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
