const nodemailer = require('nodemailer');

const sendEmail = options => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 
    }
  });

  // Define the email options
  // Actually send the email
};
