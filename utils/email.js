const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // We need to pass through 3 steps to use nodemailer
  // 1) Create a transporter
  // Service that sends the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Matheus Viana <matheus_o_viana@hotmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
