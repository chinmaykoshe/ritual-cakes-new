const router = require('express').Router();
const Customization = require('../Models/Customizationdb');
const moment = require('moment');
const transporter = require('../Controllers/mailer');

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

    const customizationDetailsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Confirmation</title>
        <style>
          body {
            padding: 25px;
            font-family: Arial, sans-serif;
            background-color: rgb(255, 228, 208);
            color: rgb(44, 44, 44);
            line-height: 1.6;
          }
    
          h1, h3 {
            color: rgb(72, 37, 11);
          }
    
          p {
            margin: 10px 0;
          }
    
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
    
          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid rgb(77, 77, 77);
          }
    
          th {
            background-color: rgb(72, 37, 11);
            color: white;
          }
    
          strong {
            color: rgb(72, 37, 11);
          }
    
          footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: rgb(77, 77, 77);
            text-align: center;
          }
    
          a {
            color: rgb(72, 37, 11);
          }
        </style>
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
        <p><strong>Delivery Date:</strong>${new Date(customization.deliveryDate).toDateString()}</p>
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

    const orderDetailsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Status Update</title>
        <style>
          body {
            padding: 25px;
            font-family: Arial, sans-serif;
            background-color: rgb(255, 228, 208);
            color: rgb(44, 44, 44);
            line-height: 1.6;
          }
    
          h1, h3 {
            color: rgb(72, 37, 11);
          }
    
          p {
            margin: 10px 0;
          }
    
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
    
          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid rgb(77, 77, 77);
          }
    
          th {
            background-color: rgb(72, 37, 11);
            color: white;
          }
    
          strong {
            color: rgb(72, 37, 11);
          }
    
          footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: rgb(77, 77, 77);
            text-align: center;
          }
    
          a {
            color: rgb(72, 37, 11);
          }
        </style>
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
        <p><strong>Delivery Date:</strong>${new Date(customization.deliveryDate).toDateString()}</p>
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
      subject: `Order Status Updated as ${approvalStatus} for : ${customization._id}`,
      html: orderDetailsHtml,
    };


    console.log('Sending email...');
    console.log('Recipient:', mailOptionsUser.to);
    console.log('Subject:', mailOptionsUser.subject);
    console.log('HTML Content:', mailOptionsUser.html);

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
