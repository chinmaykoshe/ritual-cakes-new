const express = require('express');
const { signupValidation, loginValidation } = require('./Middlewares/AuthValidation');
const { signup, login } = require('../Controllers/AuthController');
const router = express.Router(); // Initialize the Router

// Signup and Login Routes
router.post('/signup', signupValidation, signup);

router.post('/login', loginValidation, login);


// Export the router
module.exports = router;
