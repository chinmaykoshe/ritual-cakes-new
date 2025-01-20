const Joi = require('joi');


// Signup Validation Middleware
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    surname: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string()
      .pattern(/^\d{10}$/)  // Ensure the mobile number has exactly 10 digits
      .message('Mobile number must be exactly 10 digits long.')
      .required(),
    dob: Joi.string().allow('').optional(),
    address: Joi.string().min(4).max(100).required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ message: 'Bad Request', error: errorMessage });
  }

  next();
};

// Login Validation Middleware
const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Bad Request', error: error.details.map(e => e.message).join(', ') });
  }

  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};
