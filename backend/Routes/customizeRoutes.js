const router = require('express').Router();
const Customization = require('../Models/Customizationdb');
const moment = require('moment');
const transporter = require('../Controllers/mailer');

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

    // Prepare email content for the user
    const customizationDetailsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Confirmation</title>
      </head>
      <body>
        <h1>Thank You for Your Order!</h1>
        <p>Your order <strong>${customization._id}</strong> has been completed and is being processed.</p>
        <p><strong>Order Number:</strong> ${customization._id}</p>
        <h3>Orderer's Information:</h3>
        <p><strong>Name:</strong> ${customization.name}</p>
        <p><strong>Email:</strong> ${customization.email}</p>
        <h3>Order Details:</h3>
        <p><strong>Size:</strong> ${customization.size}</p>
        <p><strong>Cake Type:</strong> ${customization.cakeType}</p>
        <p><strong>Flavor:</strong> ${customization.flavor}</p>
        <p><strong>Special Instructions:</strong> ${customization.specialInstructions || 'None'}</p>
        <p><strong>Delivery Date:</strong> ${customization.deliveryDate}</p>
        <h3>Shipping Address:</h3>
        <p>${customization.address}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;

    // Email options
    const mailOptionsUser = {
      from: 'ritualcakes2019@gmail.com',
      to: customization.email,
      subject: `Order Confirmation: ${customization._id}`,
      html: customizationDetailsHtml,
    };

    const mailOptionsAdmin = {
      from: 'ritualcakes2019@gmail.com',
      to: 'ritualcakes2019@gmail.com',
      subject: `New Order: ${customization._id}`,
      html: customizationDetailsHtml,
    };

    // Send emails
    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsAdmin);

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
    const customizations = await Customization.find({ email: req.params.email });
    
    if (customizations.length === 0) {
      return res.status(404).json({ message: "Customization not found" });
    }
    res.status(200).json(customizations);
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

    // Prepare email content for the user
    const orderDetailsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Status Update</title>
      </head>
      <body>
        <h1>Order Status Update</h1>
        <p>The status of your order <strong>${customization._id}</strong> has been updated to <strong>${approvalStatus}</strong>.</p>
        <p><strong>Order Number:</strong> ${customization._id}</p>
        <h3>Order Details:</h3>
        <p><strong>Size:</strong> ${customization.size}</p>
        <p><strong>Cake Type:</strong> ${customization.cakeType}</p>
        <p><strong>Flavor:</strong> ${customization.flavor}</p>
        <p><strong>Special Instructions:</strong> ${customization.specialInstructions || 'None'}</p>
        <p><strong>Delivery Date:</strong> ${customization.deliveryDate}</p>
        <h3>Shipping Address:</h3>
        <p>${customization.address}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;

    // Email options to send to the user
    const mailOptionsUser = {
      from: 'ritualcakes2019@gmail.com',
      to: customization.email,
      subject: `Order Status Update: ${customization._id}`,
      html: orderDetailsHtml,
    };

    // Send email to the user
    try {
      await transporter.sendMail(mailOptionsUser);
      console.log('Email sent to user successfully');
    } catch (error) {
      console.error('Error sending email to user:', error.message);
    }

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
