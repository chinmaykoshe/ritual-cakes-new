const router = require('express').Router();
const Customization = require('../Models/Customizationdb');
const moment = require('moment');
const transporter = require('../Controllers/mailer');

router.post('/customizations', async (req, res) => {
  try {
    const { name, email, phone, address, size, cakeType, flavor, message, specialInstructions, deliveryDate, imageOrDesign } = req.body;
    const twoDaysLater = moment().add(2, 'days').startOf('day').toDate();
    if (new Date(deliveryDate) < twoDaysLater) {
      return res.status(400).json({ message: "Delivery date must be at least two days from now." });
    }
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
      approvalStatus: 'pending',
      price: 0
    });
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
        <p>Your order <strong>${customization._id}</strong> has been recived and is being processed.</p>
        <p><strong>Order Number:</strong> ${customization._id}</p>
        <h3>Orderer's Information:</h3>
        <table border="1">
        <tr>
          <th>Field</th>
          <th>Details</th>
        </tr>
        <tr>
          <td>Name</td>
          <td>${customization.name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${customization.email}</td>
        </tr>
        <tr>
          <td>Size</td>
          <td>${customization.size}</td>
        </tr>
        <tr>
          <td>Cake Type</td>
          <td>${customization.cakeType}</td>
        </tr>
        <tr>
          <td>Flavor</td>
          <td>${customization.flavor}</td>
        </tr>
        <tr>
          <td>Special Instructions</td>
        <td>${customization.specialInstructions || 'None'}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${new Date(customization.deliveryDate).toDateString()}</td>
          </tr>
        </table>
        <h3>Shipping Address:</h3>
        <p>${customization.address}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;
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
    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsAdmin);
    res.status(201).json({ message: "Customization created successfully", customization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

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
  try {
    const { id } = req.params;
    const { approvalStatus, price } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status value" });
    }
    const updatedCustomization = await Customization.findByIdAndUpdate(
      id,
      { approvalStatus, price },
      { new: true }
    );
    if (!updatedCustomization) {
      return res.status(404).json({ message: "Customization not found" });
    }
    const email = updatedCustomization.email;
    if (!email) {
      return res.status(400).json({ message: "Email not found for this customization" });
    }
    console.log("Email fetched from database:", email);
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
        <h1>Customization Status Update</h1>
        <p>The status of your customization <strong>${updatedCustomization._id}</strong> has been updated to <strong>${approvalStatus}</strong>.</p>
        <p><strong>Customization ID:</strong> ${updatedCustomization._id}</p>
        <h3>Customization Details:</h3>
         <table border="1">
        <tr>
          <th>Field</th>
          <th>Details</th>
        </tr>
        <tr>
          <td>Name</td>
          <td>${Customization.name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${Customization.email}</td>
        </tr>
        <tr>
          <td>Size</td>
          <td>${Customization.size}</td>
        </tr>
        <tr>
          <td>Cake Type</td>
          <td>${Customization.cakeType}</td>
        </tr>
        <tr>
          <td>Flavor</td>
          <td>${Customization.flavor}</td>
        </tr>
        <tr>
          <td>Special Instructions</td>
        <td>${Customization.specialInstructions || 'None'}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${new Date(Customization.deliveryDate).toDateString()}</td>
          </tr>
        </table>
        <h3>Shipping Address:</h3>
        <p>${updatedCustomization.address}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;
    const mailOptionsUser = {
      from: 'ritualcakes2019@gmail.com',
      to: email,
      subject: `Customization Status Updated as ${approvalStatus} for ${updatedCustomization._id}`,
      html: orderDetailsHtml,
    };
    try {
      await transporter.sendMail(mailOptionsUser);
      console.log('Email sent to user successfully');
    } catch (error) {
      console.error('Error sending email to user:', error.message);
    }
    res.status(200).json({ message: "Customization status updated successfully", customization: updatedCustomization });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

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
