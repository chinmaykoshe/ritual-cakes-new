const router = require('express').Router(); // Correct usage
const Customization = require('../Models/Customizationdb'); // Assuming model file is at this path
const moment = require('moment');

// -------------------------- USER ROUTES --------------------------

/**
 * POST route to create a new customization
 * This route allows users to submit a customization request.
 */
router.post('/customizations', async (req, res) => {
  try {
    // Destructure form data from request body
    const { name, email, phone, address, size, cakeType, flavor, message, specialInstructions, deliveryDate, imageOrDesign } = req.body;

    // Ensure deliveryDate is at least 2 days ahead
    const twoDaysLater = moment().add(2, 'days').startOf('day').toDate();
    if (new Date(deliveryDate) < twoDaysLater) {
      return res.status(400).json({ message: "Delivery date must be at least two days from now." });
    }

    // Create the customization
    const customization = new Customization({
      name,
      email,
      phone,
      address,
      size,
      cakeType,
      flavor,
      message,
      specialInstructions,
      deliveryDate,
      imageOrDesign,
      approvalStatus: 'pending', // Default approval status
      price: 0 // Default price
    });

    // Save the customization to the database
    await customization.save();
    res.status(201).json({ message: "Customization created successfully", customization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET route to fetch all customizations
 * This route allows users to view all their customization requests.
 */
router.get('/customizations', async (req, res) => {
  try {
    const customizations = await Customization.find();
    res.status(200).json(customizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET route to fetch a single customization by email
 * This route allows users to view their specific customization by email.
 */
router.get('/customizations/:email', async (req, res) => {
  try {
    // Find customization by email instead of id
    const customization = await Customization.find({ email: req.params.email });
    
    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }
    res.status(200).json(customization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------- ADMIN ROUTES --------------------------

/**
 * PUT route to update the price and approval status (for admin)
 * This route allows the admin to approve or reject a customization and set its price.
 */
router.put('/customizations/:id', async (req, res) => {
  const { approvalStatus, price } = req.body;
  
  // Validate that price and approvalStatus are provided for update
  if (approvalStatus && !['pending', 'approved', 'rejected'].includes(approvalStatus)) {
    return res.status(400).json({ message: "Invalid approval status" });
  }

  try {
    const customization = await Customization.findByIdAndUpdate(
      req.params.id,
      { approvalStatus, price },
      { new: true }
    );

    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }

    res.status(200).json({ message: "Customization updated successfully", customization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE route to remove a customization (optional, if needed)
 * This route allows the admin to delete a customization request.
 */
router.delete('/customizations/:id', async (req, res) => {
  try {
    const customization = await Customization.findByIdAndDelete(req.params.id);
    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }
    res.status(200).json({ message: "Customization deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
