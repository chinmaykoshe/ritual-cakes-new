const nodemailer = require('nodemailer');


// Replace these with your actual email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: "ritualcakes2019@gmail.com",
      pass: "spobqwcjjghrlqkq",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  
// Verify the transporter is working
transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring email transporter:', error);
  } else {
    console.log('Email transporter is configured and ready to send emails');
  }
});

module.exports = transporter;