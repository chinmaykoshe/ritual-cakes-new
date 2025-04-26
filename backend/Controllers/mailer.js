const nodemailer = require('nodemailer');
const mailKey = process.env.EMAIL_KEY;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: "ritualcakes2019@gmail.com",
      pass: mailKey,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring email transporter:', error);
  } else {
    console.log('Email transporter is configured and ready to send emails');
  }
});

module.exports = transporter;