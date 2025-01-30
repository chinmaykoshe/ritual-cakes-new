const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    set: (email) => email.toLowerCase()
  },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  size: { type: String, required: true },
  cakeType: { type: String, required: true },
  flavor: { type: String, required: true },
  message: { type: String },
  specialInstructions: { type: String },
  deliveryDate: { type: Date, required: true },
  approvalStatus: { type: String, default: 'pending' },
  price: { type: Number, default: 0 },
  imageOrDesign: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Customization', customizationSchema);
