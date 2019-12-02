const nodemailer = require('nodemailer');

const sendEmail = options => {
  // We need to pass through 3 steps to use nodemailer
  // 1) Create a transporter
  // Service that sends the email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      password: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  // 3) Actually send the email
};
